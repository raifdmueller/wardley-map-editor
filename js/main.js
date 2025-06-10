/**
 * Main application entry point for Wardley Map Editor
 * Initializes and coordinates all components
 */

import { WardleyMap } from './models/WardleyMap.js';
import { MapEditor } from './ui/MapEditor.js';
import { DrawIOExporter } from './export/DrawIOExporter.js';

class WardleyMapApplication {
    constructor() {
        this.map = null;
        this.editor = null;
        this.exporter = null;
        this.currentMode = 'select';
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        // Initialize data model
        this.map = new WardleyMap('My Wardley Map');
        
        // Initialize exporter
        this.exporter = new DrawIOExporter();
        
        // Initialize UI
        this.initializeUI();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize map editor
        const svgElement = document.getElementById('wardley-canvas');
        this.editor = new MapEditor(svgElement, this.map);
        
        // Set up map event listeners
        this.setupMapEventListeners();
        
        // Load example if requested
        this.checkForExampleLoad();
        
        console.log('Wardley Map Editor initialized successfully');
    }

    /**
     * Initialize UI elements and their initial states
     */
    initializeUI() {
        // Update title input
        const titleInput = document.getElementById('map-title');
        if (titleInput) {
            titleInput.value = this.map.title;
        }

        // Set initial mode
        this.setMode('select');
        
        // Update statistics
        this.updateStatistics();
    }

    /**
     * Set up DOM event listeners
     */
    setupEventListeners() {
        // Toolbar buttons
        this.setupToolbarListeners();
        
        // Action buttons
        this.setupActionListeners();
        
        // Map title input
        this.setupTitleInput();
        
        // Modal events
        this.setupModalListeners();
        
        // Keyboard events
        this.setupKeyboardListeners();
        
        // Evolution slider
        this.setupEvolutionSlider();
    }

    /**
     * Set up toolbar event listeners
     */
    setupToolbarListeners() {
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                if (tool) {
                    this.setMode(tool);
                }
            });
        });
    }

    /**
     * Set up action button listeners
     */
    setupActionListeners() {
        // Clear map
        const clearBtn = document.getElementById('clear-map');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear the entire map?')) {
                    this.map.clear();
                    this.updateStatus('Map cleared');
                }
            });
        }

        // Export to draw.io
        const exportBtn = document.getElementById('export-drawio');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.showExportModal();
            });
        }

        // Load example
        const exampleBtn = document.getElementById('load-example');
        if (exampleBtn) {
            exampleBtn.addEventListener('click', () => {
                this.loadExampleMap();
            });
        }
    }

    /**
     * Set up map title input
     */
    setupTitleInput() {
        const titleInput = document.getElementById('map-title');
        if (titleInput) {
            titleInput.addEventListener('input', (e) => {
                this.map.title = e.target.value || 'Untitled Map';
            });

            titleInput.addEventListener('blur', (e) => {
                if (!e.target.value.trim()) {
                    e.target.value = this.map.title;
                }
            });
        }
    }

    /**
     * Set up modal event listeners
     */
    setupModalListeners() {
        const modal = document.getElementById('export-modal');
        const confirmBtn = document.getElementById('confirm-export');
        const cancelBtn = document.getElementById('cancel-export');

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.exportToDrawIO();
                this.hideExportModal();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideExportModal();
            });
        }

        // Close modal on background click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideExportModal();
                }
            });
        }
    }

    /**
     * Set up keyboard event listeners
     */
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Don't handle keyboard events when user is typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Handle mode switching
            switch (e.key) {
                case '1':
                    this.setMode('select');
                    break;
                case '2':
                    this.setMode('component');
                    break;
                case '3':
                    this.setMode('connection');
                    break;
                case 'Escape':
                    this.setMode('select');
                    break;
            }

            // Forward to editor
            if (this.editor) {
                this.editor.handleKeyDown(e);
            }
        });
    }

    /**
     * Set up evolution slider
     */
    setupEvolutionSlider() {
        const slider = document.getElementById('evolution-slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                const evolution = parseInt(e.target.value);
                // This could be used to set default evolution for new components
                // For now, just update the status
                const stages = ['Genesis', 'Custom Built', 'Product', 'Commodity'];
                this.updateStatus(`Default evolution: ${stages[evolution]}`);
            });
        }
    }

    /**
     * Set up map model event listeners
     */
    setupMapEventListeners() {
        this.map.on('change', () => {
            this.updateStatistics();
        });

        this.map.on('componentAdded', (data) => {
            this.updateStatus(`Component "${data.component.name}" added`);
        });

        this.map.on('componentRemoved', (data) => {
            this.updateStatus('Component removed');
        });

        this.map.on('connectionAdded', (data) => {
            const fromComp = this.map.getComponent(data.connection.fromId);
            const toComp = this.map.getComponent(data.connection.toId);
            if (fromComp && toComp) {
                this.updateStatus(`Connection created: ${fromComp.name} → ${toComp.name}`);
            }
        });

        this.map.on('selectionChanged', (data) => {
            const count = data.selected.length;
            if (count === 0) {
                this.updateStatus('Nothing selected');
            } else {
                this.updateStatus(`${count} item(s) selected`);
            }
        });
    }

    /**
     * Set editor mode
     */
    setMode(mode) {
        this.currentMode = mode;
        
        // Update UI
        this.updateModeIndicator(mode);
        this.updateToolbarSelection(mode);
        
        // Update editor
        if (this.editor) {
            this.editor.setMode(mode);
        }
        
        // Update status
        const modeNames = {
            'select': 'Select and edit',
            'component': 'Add components',
            'connection': 'Create connections'
        };
        this.updateStatus(modeNames[mode] || mode);
    }

    /**
     * Update mode indicator
     */
    updateModeIndicator(mode) {
        const indicator = document.getElementById('mode-indicator');
        if (indicator) {
            const modeLabels = {
                'select': 'Select',
                'component': 'Component',
                'connection': 'Connection'
            };
            indicator.textContent = modeLabels[mode] || mode;
        }
    }

    /**
     * Update toolbar button selection
     */
    updateToolbarSelection(mode) {
        // Remove active class from all tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to current mode button
        const activeButton = document.querySelector(`[data-tool="${mode}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    /**
     * Update statistics display
     */
    updateStatistics() {
        const stats = this.map.getStats();
        
        const componentCount = document.getElementById('component-count');
        if (componentCount) {
            componentCount.textContent = `${stats.componentCount} component${stats.componentCount !== 1 ? 's' : ''}`;
        }

        const connectionCount = document.getElementById('connection-count');
        if (connectionCount) {
            connectionCount.textContent = `${stats.connectionCount} connection${stats.connectionCount !== 1 ? 's' : ''}`;
        }
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
     * Show export modal
     */
    showExportModal() {
        const modal = document.getElementById('export-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * Hide export modal
     */
    hideExportModal() {
        const modal = document.getElementById('export-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Export map to draw.io format
     */
    exportToDrawIO() {
        try {
            const validation = this.exporter.validateForExport(this.map);
            
            if (!validation.valid) {
                alert('Cannot export: ' + validation.errors.join(', '));
                return;
            }

            if (validation.warnings.length > 0) {
                const proceed = confirm(
                    'Export has warnings:\n' + 
                    validation.warnings.join('\n') + 
                    '\n\nProceed anyway?'
                );
                if (!proceed) return;
            }

            this.exporter.downloadXML(this.map);
            this.updateStatus('Map exported to draw.io format');
            
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export map: ' + error.message);
        }
    }

    /**
     * Load example map
     */
    loadExampleMap() {
        const exampleData = {
            title: 'Example Tea Shop Map',
            components: [
                {
                    id: 'component-1',
                    name: 'Cup of Tea',
                    x: 400,
                    y: 100,
                    evolution: 3,
                    visibility: 0.9
                },
                {
                    id: 'component-2',
                    name: 'Tea Leaves',
                    x: 200,
                    y: 200,
                    evolution: 2,
                    visibility: 0.6
                },
                {
                    id: 'component-3',
                    name: 'Hot Water',
                    x: 600,
                    y: 250,
                    evolution: 3,
                    visibility: 0.4
                },
                {
                    id: 'component-4',
                    name: 'Kettle',
                    x: 500,
                    y: 350,
                    evolution: 3,
                    visibility: 0.3
                },
                {
                    id: 'component-5',
                    name: 'Tea Plantation',
                    x: 100,
                    y: 400,
                    evolution: 1,
                    visibility: 0.2
                }
            ],
            connections: [
                {
                    id: 'connection-1',
                    fromId: 'component-2',
                    toId: 'component-1',
                    type: 'dependency'
                },
                {
                    id: 'connection-2',
                    fromId: 'component-3',
                    toId: 'component-1',
                    type: 'dependency'
                },
                {
                    id: 'connection-3',
                    fromId: 'component-4',
                    toId: 'component-3',
                    type: 'dependency'
                },
                {
                    id: 'connection-4',
                    fromId: 'component-5',
                    toId: 'component-2',
                    type: 'dependency'
                }
            ]
        };

        if (this.map.getAllComponents().length > 0) {
            const proceed = confirm('This will replace the current map. Continue?');
            if (!proceed) return;
        }

        this.map.import(exampleData);
        
        // Update title input
        const titleInput = document.getElementById('map-title');
        if (titleInput) {
            titleInput.value = this.map.title;
        }

        this.updateStatus('Example map loaded');
    }

    /**
     * Check if example should be loaded on startup
     */
    checkForExampleLoad() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('example') === 'true') {
            this.loadExampleMap();
        }
    }

    /**
     * Get application state for debugging
     */
    getDebugInfo() {
        return {
            mode: this.currentMode,
            map: this.map.export(),
            stats: this.map.getStats(),
            selection: this.map.getSelection()
        };
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance for debugging
    window.wardleyApp = new WardleyMapApplication();
});

// Help users understand keyboard shortcuts
console.log(`
Wardley Map Editor - Keyboard Shortcuts:
========================================
1: Select mode
2: Component mode  
3: Connection mode
ESC: Return to select mode
Delete/Backspace: Delete selected items

Add ?example=true to URL to load an example map.
`);
