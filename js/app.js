import { MapStateManager } from './MapStateManager.js';
import { MapCanvas } from './MapCanvas.js';
import { DSLParser } from './DSLParser.js';
import { ExportManager } from './ExportManager.js';

class WardleyMapApp {
    constructor() {
        this.stateManager = new MapStateManager();
        this.canvas = new MapCanvas('wardley-canvas');
        this.dslParser = new DSLParser();
        this.exportManager = new ExportManager();
        
        this.setupEventListeners();
        this.setupCanvasCallbacks();
        this.setupStateSubscription();
        
        // Initial render
        this.updateUI();
    }

    setupEventListeners() {
        // Toolbar buttons
        document.getElementById('add-component-btn').addEventListener('click', 
            () => this.addComponent());
        document.getElementById('export-btn').addEventListener('click', 
            () => this.exportToDrawIO());
        document.getElementById('save-btn').addEventListener('click', 
            () => this.saveMap());
        document.getElementById('load-btn').addEventListener('click', 
            () => this.loadMap());

        // Canvas controls
        document.getElementById('zoom-in-btn').addEventListener('click', 
            () => this.canvas.zoom(1.2));
        document.getElementById('zoom-out-btn').addEventListener('click', 
            () => this.canvas.zoom(0.8));
        document.getElementById('reset-view-btn').addEventListener('click', 
            () => this.canvas.resetView());

        // DSL input
        document.getElementById('parse-dsl-btn').addEventListener('click', 
            () => this.parseDSL());

        // Properties panel
        document.getElementById('map-title').addEventListener('input', 
            (e) => this.updateMapTitle(e.target.value));
        document.getElementById('component-label').addEventListener('input', 
            (e) => this.updateSelectedComponentLabel(e.target.value));
        document.getElementById('component-x').addEventListener('input', 
            (e) => this.updateSelectedComponentX(e.target.value / 100));
        document.getElementById('component-y').addEventListener('input', 
            (e) => this.updateSelectedComponentY(e.target.value / 100));
        document.getElementById('delete-component-btn').addEventListener('click', 
            () => this.deleteSelectedComponent());

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    setupCanvasCallbacks() {
        this.canvas.onComponentSelect = (componentId) => {
            this.stateManager.selectComponent(componentId);
        };

        this.canvas.onComponentMove = (componentId, x, y) => {
            this.stateManager.updateComponent(componentId, { x, y });
        };

        this.canvas.onCanvasClick = (x, y) => {
            if (this.isAddingComponent) {
                this.addComponentAt(x, y);
                this.isAddingComponent = false;
                this.updateAddComponentButton();
            } else {
                this.stateManager.selectComponent(null);
            }
        };
    }

    setupStateSubscription() {
        this.stateManager.subscribe((state) => {
            this.canvas.updateMapState(state);
            this.updateUI();
        });
    }

    updateUI() {
        const state = this.stateManager.state;
        
        // Update map title
        document.getElementById('map-title').value = state.title;
        
        // Update component properties panel
        const selectedComponent = this.stateManager.getSelectedComponent();
        const componentPanel = document.getElementById('component-properties');
        
        if (selectedComponent) {
            componentPanel.style.display = 'block';
            document.getElementById('component-label').value = selectedComponent.label;
            document.getElementById('component-x').value = Math.round(selectedComponent.x * 100);
            document.getElementById('component-y').value = Math.round(selectedComponent.y * 100);
        } else {
            componentPanel.style.display = 'none';
        }

        // Update DSL input
        const dslInput = document.getElementById('dsl-input');
        if (!dslInput.dataset.userModified) {
            dslInput.value = this.dslParser.generateDSL(state);
        }
    }

    addComponent() {
        this.isAddingComponent = true;
        this.updateAddComponentButton();
        this.canvas.canvas.style.cursor = 'crosshair';
    }

    addComponentAt(x, y) {
        const component = this.stateManager.addComponent({
            label: `Component ${this.stateManager.state.components.length + 1}`,
            x: x,
            y: y
        });
        this.stateManager.selectComponent(component.id);
        this.canvas.canvas.style.cursor = 'default';
    }

    updateAddComponentButton() {
        const btn = document.getElementById('add-component-btn');
        btn.textContent = this.isAddingComponent ? 'Click to Place' : 'Add Component';
        btn.style.backgroundColor = this.isAddingComponent ? '#e67e22' : '#3498db';
    }

    exportToDrawIO() {
        try {
            this.exportManager.exportMapToDrawIO(this.stateManager.state);
            this.showNotification('Map exported to draw.io format successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            this.showNotification('Export failed: ' + error.message, 'error');
        }
    }

    saveMap() {
        try {
            this.exportManager.exportMapToJSON(this.stateManager.state);
            this.showNotification('Map saved successfully!');
        } catch (error) {
            console.error('Save failed:', error);
            this.showNotification('Save failed: ' + error.message, 'error');
        }
    }

    loadMap() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const mapState = this.exportManager.importFromJSON(e.target.result);
                        if (this.stateManager.importState(JSON.stringify(mapState))) {
                            this.showNotification('Map loaded successfully!');
                        } else {
                            this.showNotification('Failed to load map: Invalid format', 'error');
                        }
                    } catch (error) {
                        console.error('Load failed:', error);
                        this.showNotification('Load failed: ' + error.message, 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    parseDSL() {
        const dslText = document.getElementById('dsl-input').value;
        
        try {
            const parsed = this.dslParser.parse(dslText);
            
            if (parsed.errors.length > 0) {
                const errorMessages = parsed.errors.map(e => `Line ${e.line}: ${e.message}`);
                this.showNotification('DSL Parse Errors:\n' + errorMessages.join('\n'), 'error');
                return;
            }

            const newState = this.dslParser.generateMapState(parsed);
            this.stateManager.state = newState;
            this.stateManager.saveToStorage();
            this.stateManager.notifyListeners();
            
            document.getElementById('dsl-input').dataset.userModified = 'false';
            this.showNotification(`Parsed successfully: ${parsed.components.length} components, ${parsed.connections.length} connections`);
            
        } catch (error) {
            console.error('DSL Parse failed:', error);
            this.showNotification('DSL Parse failed: ' + error.message, 'error');
        }
    }

    updateMapTitle(title) {
        this.stateManager.updateState({ title });
    }

    updateSelectedComponentLabel(label) {
        const selected = this.stateManager.getSelectedComponent();
        if (selected) {
            this.stateManager.updateComponent(selected.id, { label });
        }
    }

    updateSelectedComponentX(x) {
        const selected = this.stateManager.getSelectedComponent();
        if (selected) {
            this.stateManager.updateComponent(selected.id, { x });
        }
    }

    updateSelectedComponentY(y) {
        const selected = this.stateManager.getSelectedComponent();
        if (selected) {
            this.stateManager.updateComponent(selected.id, { y });
        }
    }

    deleteSelectedComponent() {
        const selected = this.stateManager.getSelectedComponent();
        if (selected && confirm(`Delete component "${selected.label}"?`)) {
            this.stateManager.removeComponent(selected.id);
        }
    }

    handleKeydown(event) {
        // Handle keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 's':
                    event.preventDefault();
                    this.saveMap();
                    break;
                case 'o':
                    event.preventDefault();
                    this.loadMap();
                    break;
                case 'e':
                    event.preventDefault();
                    this.exportToDrawIO();
                    break;
                case 'n':
                    event.preventDefault();
                    this.addComponent();
                    break;
            }
        }
        
        // Delete selected component
        if (event.key === 'Delete' || event.key === 'Backspace') {
            const selected = this.stateManager.getSelectedComponent();
            if (selected) {
                event.preventDefault();
                this.deleteSelectedComponent();
            }
        }
        
        // Escape to cancel adding component
        if (event.key === 'Escape' && this.isAddingComponent) {
            this.isAddingComponent = false;
            this.updateAddComponentButton();
            this.canvas.canvas.style.cursor = 'default';
        }
    }

    showNotification(message, type = 'success') {
        // Create simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
            color: white;
            padding: 1rem;
            border-radius: 4px;
            max-width: 300px;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WardleyMapApp();
});

// DSL input tracking
document.addEventListener('DOMContentLoaded', () => {
    const dslInput = document.getElementById('dsl-input');
    dslInput.addEventListener('input', () => {
        dslInput.dataset.userModified = 'true';
    });
});