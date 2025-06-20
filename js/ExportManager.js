export class ExportManager {
    constructor() {
        this.drawioNamespace = 'http://www.jgraph.com/xml';
    }

    exportToDrawIO(mapState) {
        const xml = this.createDrawIOXML();
        const root = xml.documentElement;
        
        // Create diagram element
        const diagram = xml.createElement('diagram');
        diagram.setAttribute('name', mapState.title || 'Wardley Map');
        diagram.setAttribute('id', this.generateId());
        
        // Create mxGraphModel
        const model = xml.createElement('mxGraphModel');
        model.setAttribute('dx', '800');
        model.setAttribute('dy', '600');
        model.setAttribute('grid', '1');
        model.setAttribute('gridSize', '10');
        model.setAttribute('guides', '1');
        model.setAttribute('tooltips', '1');
        model.setAttribute('connect', '1');
        model.setAttribute('arrows', '1');
        model.setAttribute('fold', '1');
        model.setAttribute('page', '1');
        model.setAttribute('pageScale', '1');
        model.setAttribute('pageWidth', '827');
        model.setAttribute('pageHeight', '1169');
        model.setAttribute('math', '0');
        model.setAttribute('shadow', '0');
        
        // Create root element
        const rootElement = xml.createElement('root');
        
        // Add default cells
        const cell0 = xml.createElement('mxCell');
        cell0.setAttribute('id', '0');
        
        const cell1 = xml.createElement('mxCell');
        cell1.setAttribute('id', '1');
        cell1.setAttribute('parent', '0');
        
        rootElement.appendChild(cell0);
        rootElement.appendChild(cell1);
        
        // Add map components
        const componentCells = [];
        mapState.components.forEach(component => {
            const cell = this.createComponentCell(xml, component);
            rootElement.appendChild(cell);
            componentCells.push({ id: component.id, cellId: cell.getAttribute('id') });
        });
        
        // Add connections
        mapState.connections.forEach(connection => {
            const fromCell = componentCells.find(c => c.id === connection.from);
            const toCell = componentCells.find(c => c.id === connection.to);
            
            if (fromCell && toCell) {
                const connectionCell = this.createConnectionCell(xml, fromCell.cellId, toCell.cellId);
                rootElement.appendChild(connectionCell);
            }
        });
        
        // Add axes as background shapes
        const axesGroup = this.createAxesGroup(xml);
        rootElement.appendChild(axesGroup);
        
        model.appendChild(rootElement);
        diagram.appendChild(model);
        root.appendChild(diagram);
        
        return new XMLSerializer().serializeToString(xml);
    }

    createDrawIOXML() {
        const xml = document.implementation.createDocument(null, 'mxfile', null);
        const root = xml.documentElement;
        root.setAttribute('host', 'wardley-map-editor');
        root.setAttribute('modified', new Date().toISOString());
        root.setAttribute('agent', 'Wardley Map Editor');
        root.setAttribute('version', '1.0');
        root.setAttribute('etag', this.generateId());
        root.setAttribute('type', 'device');
        
        return xml;
    }

    createComponentCell(xml, component) {
        const cell = xml.createElement('mxCell');
        cell.setAttribute('id', this.generateId());
        cell.setAttribute('value', component.label);
        cell.setAttribute('style', this.getComponentStyle());
        cell.setAttribute('vertex', '1');
        cell.setAttribute('parent', '1');
        
        // Create geometry
        const geometry = xml.createElement('mxGeometry');
        const x = component.x * 700 + 50; // Scale to draw.io canvas
        const y = (1 - component.y) * 500 + 50; // Invert Y and scale
        
        geometry.setAttribute('x', x.toString());
        geometry.setAttribute('y', y.toString());
        geometry.setAttribute('width', '80');
        geometry.setAttribute('height', '40');
        geometry.setAttribute('as', 'geometry');
        
        cell.appendChild(geometry);
        return cell;
    }

    createConnectionCell(xml, sourceId, targetId) {
        const cell = xml.createElement('mxCell');
        cell.setAttribute('id', this.generateId());
        cell.setAttribute('value', '');
        cell.setAttribute('style', this.getConnectionStyle());
        cell.setAttribute('edge', '1');
        cell.setAttribute('parent', '1');
        cell.setAttribute('source', sourceId);
        cell.setAttribute('target', targetId);
        
        // Create geometry
        const geometry = xml.createElement('mxGeometry');
        geometry.setAttribute('relative', '1');
        geometry.setAttribute('as', 'geometry');
        
        cell.appendChild(geometry);
        return cell;
    }

    createAxesGroup(xml) {
        const group = xml.createElement('mxCell');
        group.setAttribute('id', this.generateId());
        group.setAttribute('value', 'Wardley Map Axes');
        group.setAttribute('style', 'group');
        group.setAttribute('vertex', '1');
        group.setAttribute('parent', '1');
        
        const geometry = xml.createElement('mxGeometry');
        geometry.setAttribute('x', '20');
        geometry.setAttribute('y', '20');
        geometry.setAttribute('width', '760');
        geometry.setAttribute('height', '560');
        geometry.setAttribute('as', 'geometry');
        
        group.appendChild(geometry);
        return group;
    }

    getComponentStyle() {
        return 'rounded=1;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;fontColor=#000000;';
    }

    getConnectionStyle() {
        return 'endArrow=classic;html=1;rounded=0;strokeColor=#6c8ebf;fillColor=#dae8fc;';
    }

    exportToJSON(mapState) {
        return JSON.stringify(mapState, null, 2);
    }

    downloadFile(content, filename, mimeType = 'application/octet-stream') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    exportMapToDrawIO(mapState) {
        const xml = this.exportToDrawIO(mapState);
        const filename = `${mapState.title.replace(/\s+/g, '_')}.drawio`;
        this.downloadFile(xml, filename, 'application/xml');
        return xml;
    }

    exportMapToJSON(mapState) {
        const json = this.exportToJSON(mapState);
        const filename = `${mapState.title.replace(/\s+/g, '_')}.json`;
        this.downloadFile(json, filename, 'application/json');
        return json;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Import functionality for completeness
    importFromJSON(jsonString) {
        try {
            const mapState = JSON.parse(jsonString);
            if (this.validateMapState(mapState)) {
                return mapState;
            }
            throw new Error('Invalid map state format');
        } catch (error) {
            console.error('Import failed:', error);
            throw error;
        }
    }

    validateMapState(state) {
        return state && 
               typeof state.title === 'string' &&
               Array.isArray(state.components) && 
               Array.isArray(state.connections) &&
               state.components.every(c => 
                   typeof c.id === 'string' && 
                   typeof c.label === 'string' &&
                   typeof c.x === 'number' && 
                   typeof c.y === 'number'
               );
    }
}