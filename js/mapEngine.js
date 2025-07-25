class WardleyMapEngine {
    constructor() {
        this.components = new Map();
        this.dependencies = new Map();
        this.selectedComponent = null;
        this.dragState = {
            isDragging: false,
            startX: 0,
            startY: 0,
            currentElement: null
        };
        this.componentIdCounter = 1;
        
        this.initializeEventListeners();
        this.initializeCanvas();
    }
    
    initializeEventListeners() {
        document.getElementById('add-component-btn').addEventListener('click', () => this.addComponent());
        document.getElementById('export-btn').addEventListener('click', () => this.exportToDrawIo());
        document.getElementById('save-btn').addEventListener('click', () => this.saveMap());
        document.getElementById('load-btn').addEventListener('click', () => this.loadMap());
        document.getElementById('delete-component-btn').addEventListener('click', () => this.deleteSelectedComponent());
        
        document.getElementById('component-name').addEventListener('input', (e) => this.updateComponentProperty('name', e.target.value));
        document.getElementById('component-x').addEventListener('input', (e) => this.updateComponentProperty('x', parseInt(e.target.value)));
        document.getElementById('component-y').addEventListener('input', (e) => this.updateComponentProperty('y', parseInt(e.target.value)));
        document.getElementById('map-title').addEventListener('input', (e) => this.updateMapProperty('title', e.target.value));
        document.getElementById('map-author').addEventListener('input', (e) => this.updateMapProperty('author', e.target.value));
    }
    
    initializeCanvas() {
        const svg = document.getElementById('wardley-map');
        svg.addEventListener('click', (e) => this.handleCanvasClick(e));
        svg.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        svg.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        svg.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        svg.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        this.svg = svg;
        this.componentsContainer = document.getElementById('components-container');
        this.dependenciesContainer = document.getElementById('dependencies-container');
    }
    
    addComponent(x = 300, y = 400, name = null) {
        const id = `component-${this.componentIdCounter++}`;
        const componentName = name || `Component ${this.componentIdCounter - 1}`;
        
        const component = {
            id,
            name: componentName,
            x,
            y,
            width: 120,
            height: 40
        };
        
        this.components.set(id, component);
        this.renderComponent(component);
        
        return component;
    }
    
    renderComponent(component) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'wardley-component');
        group.setAttribute('data-id', component.id);
        group.setAttribute('transform', `translate(${component.x - component.width/2}, ${component.y - component.height/2})`);
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', component.width);
        rect.setAttribute('height', component.height);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', component.width / 2);
        text.setAttribute('y', component.height / 2);
        text.textContent = component.name;
        
        group.appendChild(rect);
        group.appendChild(text);
        
        group.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectComponent(component.id);
        });
        
        this.componentsContainer.appendChild(group);
    }
    
    selectComponent(componentId) {
        if (this.selectedComponent) {
            const prevSelected = document.querySelector(`[data-id="${this.selectedComponent}"]`);
            if (prevSelected) {
                prevSelected.classList.remove('selected');
            }
        }
        
        this.selectedComponent = componentId;
        const component = this.components.get(componentId);
        
        if (component) {
            const element = document.querySelector(`[data-id="${componentId}"]`);
            if (element) {
                element.classList.add('selected');
            }
            
            this.showComponentProperties(component);
        }
    }
    
    showComponentProperties(component) {
        const propertiesPanel = document.getElementById('component-properties');
        propertiesPanel.classList.remove('hidden');
        
        document.getElementById('component-name').value = component.name;
        document.getElementById('component-x').value = component.x;
        document.getElementById('component-y').value = component.y;
    }
    
    updateComponentProperty(property, value) {
        if (!this.selectedComponent) return;
        
        const component = this.components.get(this.selectedComponent);
        if (!component) return;
        
        component[property] = value;
        this.rerenderComponent(component);
    }
    
    rerenderComponent(component) {
        const element = document.querySelector(`[data-id="${component.id}"]`);
        if (element) {
            element.remove();
        }
        this.renderComponent(component);
        
        if (this.selectedComponent === component.id) {
            const newElement = document.querySelector(`[data-id="${component.id}"]`);
            if (newElement) {
                newElement.classList.add('selected');
            }
        }
    }
    
    deleteSelectedComponent() {
        if (!this.selectedComponent) return;
        
        const element = document.querySelector(`[data-id="${this.selectedComponent}"]`);
        if (element) {
            element.remove();
        }
        
        this.dependencies.forEach((dep, id) => {
            if (dep.from === this.selectedComponent || dep.to === this.selectedComponent) {
                this.dependencies.delete(id);
                const depElement = document.querySelector(`[data-dependency-id="${id}"]`);
                if (depElement) {
                    depElement.remove();
                }
            }
        });
        
        this.components.delete(this.selectedComponent);
        this.selectedComponent = null;
        
        document.getElementById('component-properties').classList.add('hidden');
    }
    
    handleCanvasClick(e) {
        if (e.target === this.svg || e.target.closest('.grid')) {
            this.deselectAllComponents();
        }
    }
    
    deselectAllComponents() {
        if (this.selectedComponent) {
            const element = document.querySelector(`[data-id="${this.selectedComponent}"]`);
            if (element) {
                element.classList.remove('selected');
            }
        }
        
        this.selectedComponent = null;
        document.getElementById('component-properties').classList.add('hidden');
    }
    
    handleMouseDown(e) {
        const componentElement = e.target.closest('.wardley-component');
        if (!componentElement) return;
        
        this.dragState.isDragging = true;
        this.dragState.currentElement = componentElement;
        
        const rect = this.svg.getBoundingClientRect();
        this.dragState.startX = e.clientX - rect.left;
        this.dragState.startY = e.clientY - rect.top;
        
        e.preventDefault();
    }
    
    handleMouseMove(e) {
        if (!this.dragState.isDragging || !this.dragState.currentElement) return;
        
        const rect = this.svg.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        const deltaX = currentX - this.dragState.startX;
        const deltaY = currentY - this.dragState.startY;
        
        const componentId = this.dragState.currentElement.getAttribute('data-id');
        const component = this.components.get(componentId);
        
        if (component) {
            const newX = Math.max(160, Math.min(1040, component.x + deltaX));
            const newY = Math.max(140, Math.min(660, component.y + deltaY));
            
            component.x = newX;
            component.y = newY;
            
            this.dragState.currentElement.setAttribute('transform', 
                `translate(${newX - component.width/2}, ${newY - component.height/2})`);
            
            if (this.selectedComponent === componentId) {
                document.getElementById('component-x').value = newX;
                document.getElementById('component-y').value = newY;
            }
        }
        
        this.dragState.startX = currentX;
        this.dragState.startY = currentY;
    }
    
    handleMouseUp(e) {
        this.dragState.isDragging = false;
        this.dragState.currentElement = null;
    }
    
    updateMapProperty(property, value) {
        if (!this.mapProperties) {
            this.mapProperties = {};
        }
        this.mapProperties[property] = value;
    }
    
    saveMap() {
        const mapData = {
            properties: this.mapProperties || {},
            components: Array.from(this.components.values()),
            dependencies: Array.from(this.dependencies.values()),
            version: '1.0',
            timestamp: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('wardley-map-data', JSON.stringify(mapData));
            this.showMessage('Map saved successfully!', 'success');
        } catch (error) {
            this.showMessage('Failed to save map: ' + error.message, 'error');
        }
    }
    
    loadMap() {
        try {
            const savedData = localStorage.getItem('wardley-map-data');
            if (!savedData) {
                this.showMessage('No saved map found', 'error');
                return;
            }
            
            const mapData = JSON.parse(savedData);
            
            this.componentsContainer.innerHTML = '';
            this.dependenciesContainer.innerHTML = '';
            this.components.clear();
            this.dependencies.clear();
            
            this.mapProperties = mapData.properties || {};
            document.getElementById('map-title').value = this.mapProperties.title || '';
            document.getElementById('map-author').value = this.mapProperties.author || '';
            
            mapData.components.forEach(comp => {
                this.components.set(comp.id, comp);
                this.renderComponent(comp);
            });
            
            mapData.dependencies.forEach(dep => {
                this.dependencies.set(dep.id, dep);
                this.renderDependency(dep);
            });
            
            this.componentIdCounter = Math.max(...mapData.components.map(c => 
                parseInt(c.id.replace('component-', '')))) + 1;
            
            this.showMessage('Map loaded successfully!', 'success');
        } catch (error) {
            this.showMessage('Failed to load map: ' + error.message, 'error');
        }
    }
    
    exportToDrawIo() {
        const drawIoGenerator = new DrawIoGenerator(this.components, this.dependencies, this.mapProperties);
        const xmlContent = drawIoGenerator.generate();
        
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.mapProperties?.title || 'wardley-map'}.drawio`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('Map exported successfully!', 'success');
    }
    
    renderDependency(dependency) {
        const fromComponent = this.components.get(dependency.from);
        const toComponent = this.components.get(dependency.to);
        
        if (!fromComponent || !toComponent) return;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'dependency-line');
        line.setAttribute('data-dependency-id', dependency.id);
        line.setAttribute('x1', fromComponent.x);
        line.setAttribute('y1', fromComponent.y);
        line.setAttribute('x2', toComponent.x);
        line.setAttribute('y2', toComponent.y);
        
        this.dependenciesContainer.appendChild(line);
    }
    
    showMessage(message, type) {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

class DrawIoGenerator {
    constructor(components, dependencies, mapProperties) {
        this.components = components;
        this.dependencies = dependencies;
        this.mapProperties = mapProperties || {};
    }
    
    generate() {
        const cells = [];
        let cellId = 1;
        
        cells.push(`<mxCell id="0"/>`);
        cells.push(`<mxCell id="1" parent="0"/>`);
        
        this.components.forEach(component => {
            const x = component.x - component.width / 2;
            const y = component.y - component.height / 2;
            
            cells.push(`<mxCell id="${cellId}" value="${this.escapeXml(component.name)}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#3498db;strokeColor=#2980b9;fontColor=#ffffff;" vertex="1" parent="1">
                <mxGeometry x="${x}" y="${y}" width="${component.width}" height="${component.height}" as="geometry"/>
            </mxCell>`);
            
            component.drawIoId = cellId;
            cellId++;
        });
        
        this.dependencies.forEach(dependency => {
            const fromComponent = this.components.get(dependency.from);
            const toComponent = this.components.get(dependency.to);
            
            if (fromComponent && toComponent) {
                cells.push(`<mxCell id="${cellId}" value="" style="endArrow=classic;html=1;rounded=0;" edge="1" parent="1" source="${fromComponent.drawIoId}" target="${toComponent.drawIoId}">
                    <mxGeometry width="50" height="50" relative="1" as="geometry">
                        <mxPoint x="${fromComponent.x}" y="${fromComponent.y}" as="sourcePoint"/>
                        <mxPoint x="${toComponent.x}" y="${toComponent.y}" as="targetPoint"/>
                    </mxGeometry>
                </mxCell>`);
                cellId++;
            }
        });
        
        return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="Electron" modified="2024-01-01T12:00:00.000Z" agent="Mozilla/5.0" version="22.1.11" etag="generated-by-wardley-map-editor" type="device">
  <diagram id="wardley-map" name="${this.escapeXml(this.mapProperties.title || 'Wardley Map')}">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        ${cells.join('\n        ')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
    }
    
    escapeXml(text) {
        return text.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#39;');
    }
}

const wardleyMapEngine = new WardleyMapEngine();