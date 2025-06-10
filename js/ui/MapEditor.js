/**
 * MapEditor - SVG-based Wardley Map Editor UI
 * Manages the visual representation and interactions of the map
 */

export class MapEditor {
    constructor(svgElement, wardleyMap) {
        this.svg = svgElement;
        this.map = wardleyMap;
        this.mode = 'select'; // select, component, connection
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.dragTarget = null;
        this.tempConnection = null;

        // Layer references
        this.connectionsLayer = this.svg.querySelector('#connections-layer');
        this.componentsLayer = this.svg.querySelector('#components-layer');
        this.tempLayer = this.svg.querySelector('#temp-layer');

        this.setupEventListeners();
        this.setupMapEventListeners();
        this.createArrowMarker();
    }

    /**
     * Set up SVG event listeners
     */
    setupEventListeners() {
        this.svg.addEventListener('click', this.handleClick.bind(this));
        this.svg.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.svg.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.svg.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.svg.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

        // Prevent default context menu
        this.svg.addEventListener('contextmenu', e => e.preventDefault());
    }

    /**
     * Set up map model event listeners
     */
    setupMapEventListeners() {
        this.map.on('componentAdded', (data) => this.renderComponent(data.component));
        this.map.on('componentUpdated', (data) => this.updateComponentElement(data.component));
        this.map.on('componentRemoved', (data) => this.removeComponentElement(data.componentId));
        this.map.on('connectionAdded', (data) => this.renderConnection(data.connection));
        this.map.on('connectionRemoved', (data) => this.removeConnectionElement(data.connectionId));
        this.map.on('selectionChanged', (data) => this.updateSelection(data.selected));
        this.map.on('mapCleared', () => this.clearCanvas());
    }

    /**
     * Create arrow marker for connections
     */
    createArrowMarker() {
        let defs = this.svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            this.svg.appendChild(defs);
        }

        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('fill', '#94a3b8');

        marker.appendChild(polygon);
        defs.appendChild(marker);
    }

    /**
     * Handle mouse click events
     */
    handleClick(event) {
        const point = this.getSVGPoint(event);
        const target = event.target;

        // Check if clicking on a component
        const componentElement = target.closest('.wardley-component');
        if (componentElement) {
            const componentId = componentElement.dataset.componentId;
            this.handleComponentClick(componentId, event);
            return;
        }

        // Check if clicking on a connection
        const connectionElement = target.closest('.wardley-connection');
        if (connectionElement) {
            const connectionId = connectionElement.dataset.connectionId;
            this.handleConnectionClick(connectionId, event);
            return;
        }

        // Click on empty space
        if (this.mode === 'component') {
            this.createComponent(point.x, point.y);
        } else if (this.mode === 'select') {
            this.map.clearSelection();
        }
    }

    /**
     * Handle component click
     */
    handleComponentClick(componentId, event) {
        if (this.mode === 'select') {
            if (event.ctrlKey || event.metaKey) {
                // Multi-select
                if (this.map.isSelected(componentId)) {
                    this.map.deselectItem(componentId);
                } else {
                    this.map.selectItem(componentId);
                }
            } else {
                // Single select
                this.map.clearSelection();
                this.map.selectItem(componentId);
            }
        } else if (this.mode === 'connection') {
            this.handleConnectionMode(componentId);
        }
    }

    /**
     * Handle connection click
     */
    handleConnectionClick(connectionId, event) {
        if (this.mode === 'select') {
            if (event.ctrlKey || event.metaKey) {
                if (this.map.isSelected(connectionId)) {
                    this.map.deselectItem(connectionId);
                } else {
                    this.map.selectItem(connectionId);
                }
            } else {
                this.map.clearSelection();
                this.map.selectItem(connectionId);
            }
        }
    }

    /**
     * Handle connection mode logic
     */
    handleConnectionMode(componentId) {
        if (!this.tempConnection) {
            // Start connection
            this.tempConnection = { fromId: componentId };
            this.updateStatus('Click on target component to create connection');
        } else if (this.tempConnection.fromId !== componentId) {
            // Complete connection
            this.map.addConnection(this.tempConnection.fromId, componentId);
            this.tempConnection = null;
            this.clearTempElements();
            this.updateStatus('Connection created');
        } else {
            // Cancel connection (clicked on same component)
            this.tempConnection = null;
            this.clearTempElements();
            this.updateStatus('Connection cancelled');
        }
    }

    /**
     * Handle mouse down for dragging
     */
    handleMouseDown(event) {
        const target = event.target;
        const componentElement = target.closest('.wardley-component');

        if (componentElement && this.mode === 'select') {
            this.isDragging = true;
            this.dragTarget = componentElement;
            
            const componentId = componentElement.dataset.componentId;
            const component = this.map.getComponent(componentId);
            const point = this.getSVGPoint(event);
            
            this.dragOffset = {
                x: point.x - component.x,
                y: point.y - component.y
            };

            event.preventDefault();
        }
    }

    /**
     * Handle mouse move for dragging and temp connections
     */
    handleMouseMove(event) {
        const point = this.getSVGPoint(event);

        if (this.isDragging && this.dragTarget) {
            const componentId = this.dragTarget.dataset.componentId;
            const newX = point.x - this.dragOffset.x;
            const newY = point.y - this.dragOffset.y;

            // Constrain to SVG bounds
            const bounds = this.getSVGBounds();
            const constrainedX = Math.max(50, Math.min(bounds.width - 50, newX));
            const constrainedY = Math.max(50, Math.min(bounds.height - 50, newY));

            this.map.updateComponent(componentId, {
                x: constrainedX,
                y: constrainedY
            });
        } else if (this.tempConnection && this.mode === 'connection') {
            this.drawTempConnection(point);
        }
    }

    /**
     * Handle mouse up to end dragging
     */
    handleMouseUp(event) {
        if (this.isDragging) {
            this.isDragging = false;
            this.dragTarget = null;
            this.dragOffset = { x: 0, y: 0 };
        }
    }

    /**
     * Handle mouse leave to cancel operations
     */
    handleMouseLeave(event) {
        this.handleMouseUp(event);
    }

    /**
     * Create a new component
     */
    createComponent(x, y) {
        const name = prompt('Component name:');
        if (name && name.trim()) {
            this.map.addComponent({
                name: name.trim(),
                x: x,
                y: y
            });
        }
    }

    /**
     * Render a component to SVG
     */
    renderComponent(component) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('wardley-component');
        group.dataset.componentId = component.id;

        // Component circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.classList.add('component-circle');
        circle.setAttribute('cx', component.x);
        circle.setAttribute('cy', component.y);
        circle.setAttribute('r', '20');

        // Component text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.classList.add('component-text');
        text.setAttribute('x', component.x);
        text.setAttribute('y', component.y);
        text.textContent = this.truncateText(component.name, 10);

        // Add title for full name on hover
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = component.name;
        group.appendChild(title);

        group.appendChild(circle);
        group.appendChild(text);

        this.componentsLayer.appendChild(group);
    }

    /**
     * Update component element
     */
    updateComponentElement(component) {
        const element = this.componentsLayer.querySelector(`[data-component-id="${component.id}"]`);
        if (!element) return;

        const circle = element.querySelector('.component-circle');
        const text = element.querySelector('.component-text');
        const title = element.querySelector('title');

        circle.setAttribute('cx', component.x);
        circle.setAttribute('cy', component.y);
        text.setAttribute('x', component.x);
        text.setAttribute('y', component.y);
        text.textContent = this.truncateText(component.name, 10);
        title.textContent = component.name;

        // Update all connections involving this component
        this.updateConnectionsForComponent(component.id);
    }

    /**
     * Remove component element
     */
    removeComponentElement(componentId) {
        const element = this.componentsLayer.querySelector(`[data-component-id="${componentId}"]`);
        if (element) {
            element.remove();
        }
    }

    /**
     * Render a connection to SVG
     */
    renderConnection(connection) {
        const fromComponent = this.map.getComponent(connection.fromId);
        const toComponent = this.map.getComponent(connection.toId);

        if (!fromComponent || !toComponent) return;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.classList.add('wardley-connection');
        line.dataset.connectionId = connection.id;
        line.setAttribute('x1', fromComponent.x);
        line.setAttribute('y1', fromComponent.y);
        line.setAttribute('x2', toComponent.x);
        line.setAttribute('y2', toComponent.y);

        // Add title for connection info
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${fromComponent.name} → ${toComponent.name}`;
        line.appendChild(title);

        this.connectionsLayer.appendChild(line);
    }

    /**
     * Remove connection element
     */
    removeConnectionElement(connectionId) {
        const element = this.connectionsLayer.querySelector(`[data-connection-id="${connectionId}"]`);
        if (element) {
            element.remove();
        }
    }

    /**
     * Update connections for a component
     */
    updateConnectionsForComponent(componentId) {
        const connections = this.map.getAllConnections();
        connections.forEach(connection => {
            if (connection.fromId === componentId || connection.toId === componentId) {
                const element = this.connectionsLayer.querySelector(`[data-connection-id="${connection.id}"]`);
                if (element) {
                    const fromComponent = this.map.getComponent(connection.fromId);
                    const toComponent = this.map.getComponent(connection.toId);
                    
                    if (fromComponent && toComponent) {
                        element.setAttribute('x1', fromComponent.x);
                        element.setAttribute('y1', fromComponent.y);
                        element.setAttribute('x2', toComponent.x);
                        element.setAttribute('y2', toComponent.y);
                    }
                }
            }
        });
    }

    /**
     * Draw temporary connection line
     */
    drawTempConnection(mousePoint) {
        this.clearTempElements();

        const fromComponent = this.map.getComponent(this.tempConnection.fromId);
        if (!fromComponent) return;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.classList.add('temp-connection');
        line.setAttribute('x1', fromComponent.x);
        line.setAttribute('y1', fromComponent.y);
        line.setAttribute('x2', mousePoint.x);
        line.setAttribute('y2', mousePoint.y);
        line.setAttribute('stroke', '#2563eb');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '5,5');

        this.tempLayer.appendChild(line);
    }

    /**
     * Clear temporary elements
     */
    clearTempElements() {
        this.tempLayer.innerHTML = '';
    }

    /**
     * Update selection visualization
     */
    updateSelection(selectedIds) {
        // Remove previous selection styles
        this.svg.querySelectorAll('.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Add selection styles
        selectedIds.forEach(id => {
            const element = this.svg.querySelector(`[data-component-id="${id}"], [data-connection-id="${id}"]`);
            if (element) {
                element.classList.add('selected');
            }
        });
    }

    /**
     * Clear the entire canvas
     */
    clearCanvas() {
        this.componentsLayer.innerHTML = '';
        this.connectionsLayer.innerHTML = '';
        this.clearTempElements();
    }

    /**
     * Set editor mode
     */
    setMode(mode) {
        this.mode = mode;
        this.tempConnection = null;
        this.clearTempElements();
        
        // Update cursor style
        this.svg.style.cursor = mode === 'component' ? 'crosshair' : 'default';
        
        this.updateStatus(`Mode: ${mode}`);
    }

    /**
     * Get SVG point from mouse event
     */
    getSVGPoint(event) {
        const CTM = this.svg.getScreenCTM();
        return {
            x: (event.clientX - CTM.e) / CTM.a,
            y: (event.clientY - CTM.f) / CTM.d
        };
    }

    /**
     * Get SVG bounds
     */
    getSVGBounds() {
        const viewBox = this.svg.getAttribute('viewBox').split(' ');
        return {
            width: parseFloat(viewBox[2]),
            height: parseFloat(viewBox[3])
        };
    }

    /**
     * Truncate text to fit in component
     */
    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength - 1) + '…' : text;
    }

    /**
     * Update status message
     */
    updateStatus(message) {
        const statusElement = document.getElementById('status-message');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    /**
     * Delete selected items
     */
    deleteSelected() {
        const selected = this.map.getSelection();
        selected.forEach(id => {
            if (id.startsWith('component-')) {
                this.map.removeComponent(id);
            } else if (id.startsWith('connection-')) {
                this.map.removeConnection(id);
            }
        });
    }

    /**
     * Handle keyboard events
     */
    handleKeyDown(event) {
        switch (event.key) {
            case 'Delete':
            case 'Backspace':
                event.preventDefault();
                this.deleteSelected();
                break;
            case 'Escape':
                this.map.clearSelection();
                this.tempConnection = null;
                this.clearTempElements();
                break;
        }
    }
}