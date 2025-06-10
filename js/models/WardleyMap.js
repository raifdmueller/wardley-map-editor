/**
 * WardleyMap Data Model
 * Manages the overall map state including components and connections
 */

export class WardleyMap {
    constructor(title = 'Untitled Map') {
        this.title = title;
        this.components = new Map();
        this.connections = new Map();
        this.nextComponentId = 1;
        this.nextConnectionId = 1;
        this.selectedItems = new Set();
        this.listeners = new Map();
    }

    /**
     * Add a component to the map
     * @param {Object} componentData - Component data (name, x, y, evolution, etc.)
     * @returns {string} Component ID
     */
    addComponent(componentData) {
        const id = `component-${this.nextComponentId++}`;
        const component = {
            id,
            name: componentData.name || 'New Component',
            x: componentData.x || 100,
            y: componentData.y || 100,
            evolution: componentData.evolution || 1, // 0: Genesis, 1: Custom, 2: Product, 3: Commodity
            visibility: componentData.visibility || 0.5, // 0: Invisible, 1: Visible
            ...componentData
        };

        this.components.set(id, component);
        this.emit('componentAdded', { component });
        this.emit('change');
        return id;
    }

    /**
     * Update a component
     * @param {string} id - Component ID
     * @param {Object} updates - Updates to apply
     */
    updateComponent(id, updates) {
        const component = this.components.get(id);
        if (!component) return false;

        Object.assign(component, updates);
        this.emit('componentUpdated', { component });
        this.emit('change');
        return true;
    }

    /**
     * Remove a component and its connections
     * @param {string} id - Component ID
     */
    removeComponent(id) {
        const component = this.components.get(id);
        if (!component) return false;

        // Remove all connections involving this component
        const connectionsToRemove = [];
        for (const [connId, connection] of this.connections) {
            if (connection.fromId === id || connection.toId === id) {
                connectionsToRemove.push(connId);
            }
        }
        connectionsToRemove.forEach(connId => this.removeConnection(connId));

        this.components.delete(id);
        this.selectedItems.delete(id);
        this.emit('componentRemoved', { componentId: id });
        this.emit('change');
        return true;
    }

    /**
     * Add a connection between components
     * @param {string} fromId - Source component ID
     * @param {string} toId - Target component ID
     * @param {Object} connectionData - Additional connection data
     * @returns {string} Connection ID
     */
    addConnection(fromId, toId, connectionData = {}) {
        // Check if components exist
        if (!this.components.has(fromId) || !this.components.has(toId)) {
            return null;
        }

        // Check if connection already exists
        for (const connection of this.connections.values()) {
            if (connection.fromId === fromId && connection.toId === toId) {
                return connection.id; // Connection already exists
            }
        }

        const id = `connection-${this.nextConnectionId++}`;
        const connection = {
            id,
            fromId,
            toId,
            type: connectionData.type || 'dependency', // dependency, evolution, etc.
            ...connectionData
        };

        this.connections.set(id, connection);
        this.emit('connectionAdded', { connection });
        this.emit('change');
        return id;
    }

    /**
     * Remove a connection
     * @param {string} id - Connection ID
     */
    removeConnection(id) {
        const connection = this.connections.get(id);
        if (!connection) return false;

        this.connections.delete(id);
        this.selectedItems.delete(id);
        this.emit('connectionRemoved', { connectionId: id });
        this.emit('change');
        return true;
    }

    /**
     * Get component by ID
     * @param {string} id - Component ID
     * @returns {Object|null} Component or null
     */
    getComponent(id) {
        return this.components.get(id) || null;
    }

    /**
     * Get connection by ID
     * @param {string} id - Connection ID
     * @returns {Object|null} Connection or null
     */
    getConnection(id) {
        return this.connections.get(id) || null;
    }

    /**
     * Get all components as array
     * @returns {Array} Array of components
     */
    getAllComponents() {
        return Array.from(this.components.values());
    }

    /**
     * Get all connections as array
     * @returns {Array} Array of connections
     */
    getAllConnections() {
        return Array.from(this.connections.values());
    }

    /**
     * Find component at coordinates
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} tolerance - Distance tolerance
     * @returns {Object|null} Component or null
     */
    getComponentAt(x, y, tolerance = 20) {
        for (const component of this.components.values()) {
            const distance = Math.sqrt(
                Math.pow(component.x - x, 2) + Math.pow(component.y - y, 2)
            );
            if (distance <= tolerance) {
                return component;
            }
        }
        return null;
    }

    /**
     * Selection management
     */
    selectItem(id) {
        this.selectedItems.add(id);
        this.emit('selectionChanged', { selected: Array.from(this.selectedItems) });
    }

    deselectItem(id) {
        this.selectedItems.delete(id);
        this.emit('selectionChanged', { selected: Array.from(this.selectedItems) });
    }

    clearSelection() {
        this.selectedItems.clear();
        this.emit('selectionChanged', { selected: [] });
    }

    isSelected(id) {
        return this.selectedItems.has(id);
    }

    getSelection() {
        return Array.from(this.selectedItems);
    }

    /**
     * Clear entire map
     */
    clear() {
        this.components.clear();
        this.connections.clear();
        this.selectedItems.clear();
        this.nextComponentId = 1;
        this.nextConnectionId = 1;
        this.emit('mapCleared');
        this.emit('change');
    }

    /**
     * Export map data
     * @returns {Object} Serializable map data
     */
    export() {
        return {
            title: this.title,
            components: Array.from(this.components.values()),
            connections: Array.from(this.connections.values()),
            metadata: {
                created: new Date().toISOString(),
                version: '1.0'
            }
        };
    }

    /**
     * Import map data
     * @param {Object} data - Map data to import
     */
    import(data) {
        this.clear();
        this.title = data.title || 'Imported Map';

        // Import components
        if (data.components) {
            data.components.forEach(comp => {
                this.components.set(comp.id, { ...comp });
                // Update next ID to avoid conflicts
                const idNum = parseInt(comp.id.replace('component-', ''));
                if (idNum >= this.nextComponentId) {
                    this.nextComponentId = idNum + 1;
                }
            });
        }

        // Import connections
        if (data.connections) {
            data.connections.forEach(conn => {
                this.connections.set(conn.id, { ...conn });
                // Update next ID to avoid conflicts
                const idNum = parseInt(conn.id.replace('connection-', ''));
                if (idNum >= this.nextConnectionId) {
                    this.nextConnectionId = idNum + 1;
                }
            });
        }

        this.emit('mapImported', { data });
        this.emit('change');
    }

    /**
     * Event system
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data = {}) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Validation
     */
    validate() {
        const errors = [];

        // Check for components without names
        for (const component of this.components.values()) {
            if (!component.name || component.name.trim() === '') {
                errors.push(`Component ${component.id} has no name`);
            }
        }

        // Check for invalid connections
        for (const connection of this.connections.values()) {
            if (!this.components.has(connection.fromId)) {
                errors.push(`Connection ${connection.id} references non-existent component ${connection.fromId}`);
            }
            if (!this.components.has(connection.toId)) {
                errors.push(`Connection ${connection.id} references non-existent component ${connection.toId}`);
            }
        }

        return errors;
    }

    /**
     * Statistics
     */
    getStats() {
        return {
            componentCount: this.components.size,
            connectionCount: this.connections.size,
            selectedCount: this.selectedItems.size
        };
    }
}