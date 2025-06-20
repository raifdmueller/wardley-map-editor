export class MapStateManager {
    constructor() {
        this.state = this.loadFromStorage() || this.getDefaultState();
        this.listeners = [];
    }

    getDefaultState() {
        return {
            title: 'Untitled Map',
            components: [],
            connections: [],
            selectedComponent: null,
            version: '1.0'
        };
    }

    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.saveToStorage();
        this.notifyListeners();
    }

    addComponent(component) {
        const newComponent = {
            id: this.generateId(),
            label: component.label || 'New Component',
            x: component.x || 0.5,
            y: component.y || 0.5,
            ...component
        };
        
        const components = [...this.state.components, newComponent];
        this.updateState({ components });
        return newComponent;
    }

    updateComponent(id, updates) {
        const components = this.state.components.map(comp => 
            comp.id === id ? { ...comp, ...updates } : comp
        );
        this.updateState({ components });
    }

    removeComponent(id) {
        const components = this.state.components.filter(comp => comp.id !== id);
        const connections = this.state.connections.filter(conn => 
            conn.from !== id && conn.to !== id
        );
        this.updateState({ components, connections, selectedComponent: null });
    }

    addConnection(fromId, toId) {
        const connectionExists = this.state.connections.some(conn => 
            conn.from === fromId && conn.to === toId
        );
        
        if (!connectionExists && fromId !== toId) {
            const connections = [...this.state.connections, {
                id: this.generateId(),
                from: fromId,
                to: toId,
                type: 'dependency'
            }];
            this.updateState({ connections });
        }
    }

    removeConnection(fromId, toId) {
        const connections = this.state.connections.filter(conn => 
            !(conn.from === fromId && conn.to === toId)
        );
        this.updateState({ connections });
    }

    selectComponent(id) {
        this.updateState({ selectedComponent: id });
    }

    getSelectedComponent() {
        return this.state.components.find(comp => comp.id === this.state.selectedComponent);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }

    saveToStorage() {
        try {
            localStorage.setItem('wardley-map-state', JSON.stringify(this.state));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('wardley-map-state');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            return null;
        }
    }

    exportState() {
        return JSON.stringify(this.state, null, 2);
    }

    importState(jsonString) {
        try {
            const newState = JSON.parse(jsonString);
            if (this.validateState(newState)) {
                this.state = newState;
                this.saveToStorage();
                this.notifyListeners();
                return true;
            }
        } catch (error) {
            console.error('Failed to import state:', error);
        }
        return false;
    }

    validateState(state) {
        return state && 
               Array.isArray(state.components) && 
               Array.isArray(state.connections) &&
               typeof state.title === 'string';
    }
}