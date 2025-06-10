/**
 * DrawIOExporter - Export Wardley Maps to draw.io XML format
 * Based on the draw.io implementation guide and mxGraph XML format
 */

export class DrawIOExporter {
    constructor() {
        // Evolution stage mapping to X coordinates
        this.evolutionMap = {
            0: 100,   // Genesis
            1: 300,   // Custom Built
            2: 500,   // Product
            3: 700    // Commodity
        };

        // Default draw.io styling
        this.defaultStyles = {
            component: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=12;fontStyle=1',
            connection: 'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#666666'
        };
    }

    /**
     * Export Wardley Map to draw.io XML format
     * @param {WardleyMap} wardleyMap - The map to export
     * @returns {string} draw.io XML content
     */
    export(wardleyMap) {
        const components = wardleyMap.getAllComponents();
        const connections = wardleyMap.getAllConnections();

        // Convert components to draw.io format
        const drawioComponents = components.map(comp => this.convertComponent(comp));
        const drawioConnections = connections.map(conn => this.convertConnection(conn, wardleyMap));

        // Generate XML
        return this.generateXML(drawioComponents, drawioConnections, wardleyMap.title);
    }

    /**
     * Convert Wardley component to draw.io format
     * @param {Object} component - Wardley component
     * @returns {Object} draw.io component data
     */
    convertComponent(component) {
        // Map Wardley coordinates to draw.io coordinates
        const drawioX = this.evolutionMap[component.evolution] || this.evolutionMap[1];
        // Invert Y axis and scale (Wardley maps have different Y orientation)
        const drawioY = this.mapVisibilityToY(component.visibility || 0.5);

        return {
            id: `comp_${component.id.replace('component-', '')}`,
            value: this.escapeXML(component.name),
            x: drawioX,
            y: drawioY,
            width: Math.max(80, component.name.length * 8), // Dynamic width based on text
            height: 40,
            style: this.getComponentStyle(component)
        };
    }

    /**
     * Convert Wardley connection to draw.io format
     * @param {Object} connection - Wardley connection
     * @param {WardleyMap} wardleyMap - The map for component lookup
     * @returns {Object} draw.io connection data
     */
    convertConnection(connection, wardleyMap) {
        const fromComponent = wardleyMap.getComponent(connection.fromId);
        const toComponent = wardleyMap.getComponent(connection.toId);

        if (!fromComponent || !toComponent) {
            console.warn(`Connection ${connection.id} references missing components`);
            return null;
        }

        return {
            id: `conn_${connection.id.replace('connection-', '')}`,
            source: `comp_${connection.fromId.replace('component-', '')}`,
            target: `comp_${connection.toId.replace('component-', '')}`,
            style: this.getConnectionStyle(connection),
            label: connection.label || ''
        };
    }

    /**
     * Map visibility value to Y coordinate
     * @param {number} visibility - Visibility value (0-1)
     * @returns {number} Y coordinate
     */
    mapVisibilityToY(visibility) {
        // Map visibility (0=invisible, 1=visible) to Y coordinates
        // Higher visibility = lower Y (top of map)
        const minY = 50;
        const maxY = 400;
        return maxY - (visibility * (maxY - minY));
    }

    /**
     * Get component styling based on evolution stage
     * @param {Object} component - Component data
     * @returns {string} draw.io style string
     */
    getComponentStyle(component) {
        const baseStyle = this.defaultStyles.component;
        
        // Color based on evolution stage
        const colorMap = {
            0: '#f8d7da;strokeColor=#721c24', // Genesis - Red
            1: '#fff3cd;strokeColor=#856404', // Custom - Yellow
            2: '#d4edda;strokeColor=#155724', // Product - Green
            3: '#d1ecf1;strokeColor=#0c5460'  // Commodity - Blue
        };

        const evolutionColor = colorMap[component.evolution] || colorMap[1];
        return baseStyle.replace('#dae8fc;strokeColor=#6c8ebf', evolutionColor);
    }

    /**
     * Get connection styling
     * @param {Object} connection - Connection data
     * @returns {string} draw.io style string
     */
    getConnectionStyle(connection) {
        let style = this.defaultStyles.connection;
        
        // Different styles for different connection types
        if (connection.type === 'evolution') {
            style += ';strokeColor=#d73027;strokeWidth=3;dashed=1';
        } else if (connection.type === 'constraint') {
            style += ';strokeColor=#fc8d62;strokeWidth=2';
        }
        
        return style;
    }

    /**
     * Generate complete draw.io XML
     * @param {Array} components - Converted components
     * @param {Array} connections - Converted connections
     * @param {string} title - Map title
     * @returns {string} Complete XML
     */
    generateXML(components, connections, title = 'Wardley Map') {
        const cellsXML = [
            ...components.map(comp => this.generateComponentXML(comp)),
            ...connections.filter(conn => conn !== null).map(conn => this.generateConnectionXML(conn))
        ].join('\n        ');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="Wardley Map Editor" version="1.0" etag="${this.generateEtag()}" type="device">
  <diagram id="wardley-map" name="${this.escapeXML(title)}">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <!-- Wardley Map Axes -->
        ${this.generateAxesXML()}
        <!-- Components -->
        ${cellsXML}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

        return xml;
    }

    /**
     * Generate XML for a component
     * @param {Object} component - Component data
     * @returns {string} Component XML
     */
    generateComponentXML(component) {
        return `<mxCell id="${component.id}" value="${component.value}" style="${component.style}" vertex="1" parent="1">
          <mxGeometry x="${component.x}" y="${component.y}" width="${component.width}" height="${component.height}" as="geometry"/>
        </mxCell>`;
    }

    /**
     * Generate XML for a connection
     * @param {Object} connection - Connection data
     * @returns {string} Connection XML
     */
    generateConnectionXML(connection) {
        const labelXML = connection.label ? ` value="${this.escapeXML(connection.label)}"` : '';
        
        return `<mxCell id="${connection.id}"${labelXML} style="${connection.style}" edge="1" parent="1" source="${connection.source}" target="${connection.target}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`;
    }

    /**
     * Generate Wardley Map axes as draw.io elements
     * @returns {string} Axes XML
     */
    generateAxesXML() {
        return `<!-- Value Chain Axis (Y) -->
        <mxCell id="axis-value-label-high" value="High Value" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=2" vertex="1" parent="1">
          <mxGeometry x="20" y="20" width="80" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="axis-value-label-low" value="Low Value" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=2" vertex="1" parent="1">
          <mxGeometry x="20" y="450" width="80" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="axis-value-title" value="Value Chain" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=14;fontStyle=3;rotation=-90" vertex="1" parent="1">
          <mxGeometry x="-10" y="235" width="40" height="20" as="geometry"/>
        </mxCell>
        
        <!-- Evolution Axis (X) -->
        <mxCell id="axis-evolution-genesis" value="Genesis" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=2" vertex="1" parent="1">
          <mxGeometry x="60" y="480" width="80" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="axis-evolution-custom" value="Custom Built" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=2" vertex="1" parent="1">
          <mxGeometry x="260" y="480" width="80" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="axis-evolution-product" value="Product (+rental)" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=2" vertex="1" parent="1">
          <mxGeometry x="430" y="480" width="100" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="axis-evolution-commodity" value="Commodity (+utility)" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=2" vertex="1" parent="1">
          <mxGeometry x="620" y="480" width="120" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="axis-evolution-title" value="Evolution" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=14;fontStyle=3" vertex="1" parent="1">
          <mxGeometry x="375" y="510" width="100" height="20" as="geometry"/>
        </mxCell>
        
        <!-- Evolution Stage Lines -->
        <mxCell id="evolution-line-1" value="" style="endArrow=none;html=1;strokeColor=#CCCCCC;strokeWidth=1;dashed=1" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="200" y="50" as="sourcePoint"/>
            <mxPoint x="200" y="450" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="evolution-line-2" value="" style="endArrow=none;html=1;strokeColor=#CCCCCC;strokeWidth=1;dashed=1" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="400" y="50" as="sourcePoint"/>
            <mxPoint x="400" y="450" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="evolution-line-3" value="" style="endArrow=none;html=1;strokeColor=#CCCCCC;strokeWidth=1;dashed=1" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="600" y="50" as="sourcePoint"/>
            <mxPoint x="600" y="450" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;
    }

    /**
     * Escape XML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeXML(text) {
        if (typeof text !== 'string') return '';
        
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Generate unique etag for the file
     * @returns {string} Etag
     */
    generateEtag() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Download exported XML as file
     * @param {WardleyMap} wardleyMap - Map to export
     * @param {string} filename - Optional filename
     */
    downloadXML(wardleyMap, filename = null) {
        const xml = this.export(wardleyMap);
        const suggestedName = filename || `${wardleyMap.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.drawio`;
        
        // Create blob and download
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = suggestedName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Validate that the map can be exported
     * @param {WardleyMap} wardleyMap - Map to validate
     * @returns {Object} Validation result
     */
    validateForExport(wardleyMap) {
        const errors = [];
        const warnings = [];

        // Check for components
        if (wardleyMap.getAllComponents().length === 0) {
            errors.push('Map has no components to export');
        }

        // Check for unnamed components
        const unnamedComponents = wardleyMap.getAllComponents().filter(comp => !comp.name || comp.name.trim() === '');
        if (unnamedComponents.length > 0) {
            warnings.push(`${unnamedComponents.length} component(s) have no name`);
        }

        // Check for orphaned connections
        const connections = wardleyMap.getAllConnections();
        const orphanedConnections = connections.filter(conn => {
            return !wardleyMap.getComponent(conn.fromId) || !wardleyMap.getComponent(conn.toId);
        });
        if (orphanedConnections.length > 0) {
            warnings.push(`${orphanedConnections.length} connection(s) reference missing components`);
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Generate preview of what will be exported
     * @param {WardleyMap} wardleyMap - Map to preview
     * @returns {Object} Export preview data
     */
    generateExportPreview(wardleyMap) {
        const validation = this.validateForExport(wardleyMap);
        const stats = wardleyMap.getStats();

        return {
            title: wardleyMap.title,
            componentCount: stats.componentCount,
            connectionCount: stats.connectionCount,
            validation,
            estimatedFileSize: this.estimateFileSize(wardleyMap),
            supportedFeatures: [
                'Component positioning based on evolution stage',
                'Value chain mapping to Y-axis',
                'Component names and styling',
                'Dependencies as connections',
                'Wardley Map axes and labels'
            ],
            limitations: [
                'Custom component icons not preserved',
                'Complex styling may be simplified',
                'Interactive features not supported in static format'
            ]
        };
    }

    /**
     * Estimate file size of exported XML
     * @param {WardleyMap} wardleyMap - Map to estimate
     * @returns {string} Human readable file size
     */
    estimateFileSize(wardleyMap) {
        const xml = this.export(wardleyMap);
        const bytes = new Blob([xml]).size;
        
        if (bytes < 1024) return `${bytes} bytes`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
}