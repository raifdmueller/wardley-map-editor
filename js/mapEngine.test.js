// TDD Tests for WardleyMapEngine - London School Approach
// Target: 85% Code Coverage

const testFramework = new TestFramework();

// Test Suite: Component Management
testFramework.describe('WardleyMapEngine - Component Management', () => {
    let engine;
    
    testFramework.beforeEach(() => {
        DOMTestUtils.setupMockDOM();
        engine = new WardleyMapEngine();
    });
    
    testFramework.afterEach(() => {
        DOMTestUtils.teardownMockDOM();
    });
    
    testFramework.it('should initialize with empty components map', () => {
        testFramework.expect(engine.components.size).toBe(0);
        testFramework.expect(engine.dependencies.size).toBe(0);
        testFramework.expect(engine.selectedComponent).toBe(null);
    });
    
    testFramework.it('should add component with default values', () => {
        const component = engine.addComponent();
        
        testFramework.expect(component.id).toContain('component-');
        testFramework.expect(component.name).toContain('Component');
        testFramework.expect(component.x).toBe(300);
        testFramework.expect(component.y).toBe(400);
        testFramework.expect(component.width).toBe(120);
        testFramework.expect(component.height).toBe(40);
        testFramework.expect(engine.components.size).toBe(1);
    });
    
    testFramework.it('should add component with custom values', () => {
        const component = engine.addComponent(500, 200, 'Custom Component');
        
        testFramework.expect(component.x).toBe(500);
        testFramework.expect(component.y).toBe(200);
        testFramework.expect(component.name).toBe('Custom Component');
    });
    
    testFramework.it('should select component and show properties', () => {
        const component = engine.addComponent();
        engine.selectComponent(component.id);
        
        testFramework.expect(engine.selectedComponent).toBe(component.id);
        
        const propertiesPanel = document.getElementById('component-properties');
        testFramework.expect(propertiesPanel.classList.contains('hidden')).toBeFalsy();
    });
    
    testFramework.it('should update component properties', () => {
        const component = engine.addComponent();
        engine.selectComponent(component.id);
        
        engine.updateComponentProperty('name', 'Updated Name');
        engine.updateComponentProperty('x', 600);
        engine.updateComponentProperty('y', 300);
        
        testFramework.expect(component.name).toBe('Updated Name');
        testFramework.expect(component.x).toBe(600);
        testFramework.expect(component.y).toBe(300);
    });
    
    testFramework.it('should delete selected component', () => {
        const component = engine.addComponent();
        engine.selectComponent(component.id);
        
        testFramework.expect(engine.components.size).toBe(1);
        
        engine.deleteSelectedComponent();
        
        testFramework.expect(engine.components.size).toBe(0);
        testFramework.expect(engine.selectedComponent).toBe(null);
    });
    
    testFramework.it('should increment component counter correctly', () => {
        const comp1 = engine.addComponent();
        const comp2 = engine.addComponent();
        
        testFramework.expect(comp1.id).toBe('component-1');
        testFramework.expect(comp2.id).toBe('component-2');
        testFramework.expect(engine.componentIdCounter).toBe(3);
    });
});

// Test Suite: Drag and Drop Functionality
testFramework.describe('WardleyMapEngine - Drag and Drop', () => {
    let engine;
    
    testFramework.beforeEach(() => {
        DOMTestUtils.setupMockDOM();
        engine = new WardleyMapEngine();
    });
    
    testFramework.afterEach(() => {
        DOMTestUtils.teardownMockDOM();
    });
    
    testFramework.it('should initialize drag state correctly', () => {
        testFramework.expect(engine.dragState.isDragging).toBeFalsy();
        testFramework.expect(engine.dragState.currentElement).toBe(null);
        testFramework.expect(engine.dragState.startX).toBe(0);
        testFramework.expect(engine.dragState.startY).toBe(0);
    });
    
    testFramework.it('should handle mouse down for dragging', () => {
        const component = engine.addComponent();
        const element = document.querySelector(`[data-id="${component.id}"]`);
        
        const mockEvent = {
            target: element,
            clientX: 100,
            clientY: 200,
            preventDefault: testFramework.mock()
        };
        
        const getBoundingClientRectSpy = testFramework.spy(engine.svg, 'getBoundingClientRect');
        getBoundingClientRectSpy.restore();
        engine.svg.getBoundingClientRect = () => ({ left: 0, top: 0 });
        
        element.closest = () => element;
        
        engine.handleMouseDown(mockEvent);
        
        testFramework.expect(engine.dragState.isDragging).toBeTruthy();
        testFramework.expect(engine.dragState.currentElement).toBe(element);
    });
    
    testFramework.it('should handle mouse up to end dragging', () => {
        engine.dragState.isDragging = true;
        engine.dragState.currentElement = {};
        
        engine.handleMouseUp({});
        
        testFramework.expect(engine.dragState.isDragging).toBeFalsy();
        testFramework.expect(engine.dragState.currentElement).toBe(null);
    });
    
    testFramework.it('should constrain component position within bounds', () => {
        const component = engine.addComponent();
        
        // Test boundary constraints
        component.x = 50;  // Too far left
        component.y = 50;  // Too far up
        
        engine.dragState.isDragging = true;
        engine.dragState.currentElement = { getAttribute: () => component.id };
        engine.dragState.startX = 50;
        engine.dragState.startY = 50;
        
        const mockEvent = {
            clientX: 0,
            clientY: 0
        };
        
        engine.svg.getBoundingClientRect = () => ({ left: 0, top: 0 });
        
        engine.handleMouseMove(mockEvent);
        
        testFramework.expect(component.x).toBe(160); // Min boundary
        testFramework.expect(component.y).toBe(140); // Min boundary
    });
});

// Test Suite: Data Persistence
testFramework.describe('WardleyMapEngine - Data Persistence', () => {
    let engine;
    
    testFramework.beforeEach(() => {
        DOMTestUtils.setupMockDOM();
        engine = new WardleyMapEngine();
        localStorage.clear();
    });
    
    testFramework.afterEach(() => {
        DOMTestUtils.teardownMockDOM();
        localStorage.clear();
    });
    
    testFramework.it('should save map data to localStorage', () => {
        engine.addComponent(300, 400, 'Test Component');
        engine.updateMapProperty('title', 'Test Map');
        engine.updateMapProperty('author', 'Test Author');
        
        engine.saveMap();
        
        const savedData = localStorage.getItem('wardley-map-data');
        testFramework.expect(savedData).toBeTruthy();
        
        const parsedData = JSON.parse(savedData);
        testFramework.expect(parsedData.components.length).toBe(1);
        testFramework.expect(parsedData.properties.title).toBe('Test Map');
        testFramework.expect(parsedData.properties.author).toBe('Test Author');
        testFramework.expect(parsedData.version).toBe('1.0');
    });
    
    testFramework.it('should load map data from localStorage', () => {
        const testData = {
            properties: { title: 'Loaded Map', author: 'Test User' },
            components: [
                { id: 'component-1', name: 'Loaded Component', x: 500, y: 300, width: 120, height: 40 }
            ],
            dependencies: [],
            version: '1.0',
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('wardley-map-data', JSON.stringify(testData));
        
        engine.loadMap();
        
        testFramework.expect(engine.components.size).toBe(1);
        testFramework.expect(engine.mapProperties.title).toBe('Loaded Map');
        testFramework.expect(engine.mapProperties.author).toBe('Test User');
        
        const component = engine.components.get('component-1');
        testFramework.expect(component.name).toBe('Loaded Component');
        testFramework.expect(component.x).toBe(500);
        testFramework.expect(component.y).toBe(300);
    });
    
    testFramework.it('should handle load error when no data exists', () => {
        const consoleSpy = testFramework.spy(engine, 'showMessage');
        
        engine.loadMap();
        
        testFramework.expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.restore();
    });
});

// Test Suite: DrawIo Export
testFramework.describe('DrawIoGenerator - XML Export', () => {
    let generator;
    let components;
    let dependencies;
    
    testFramework.beforeEach(() => {
        components = new Map();
        dependencies = new Map();
        
        components.set('comp1', {
            id: 'comp1',
            name: 'User Needs',
            x: 300,
            y: 200,
            width: 120,
            height: 40
        });
        
        components.set('comp2', {
            id: 'comp2',
            name: 'Application',
            x: 600,
            y: 400,
            width: 120,
            height: 40
        });
        
        generator = new DrawIoGenerator(components, dependencies, { title: 'Test Map' });
    });
    
    testFramework.it('should create generator with correct properties', () => {
        testFramework.expect(generator.components).toBe(components);
        testFramework.expect(generator.dependencies).toBe(dependencies);
        testFramework.expect(generator.mapProperties.title).toBe('Test Map');
    });
    
    testFramework.it('should generate valid XML structure', () => {
        const xml = generator.generate();
        
        testFramework.expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        testFramework.expect(xml).toContain('<mxfile');
        testFramework.expect(xml).toContain('<diagram id="wardley-map"');
        testFramework.expect(xml).toContain('<mxGraphModel');
        testFramework.expect(xml).toContain('</mxfile>');
    });
    
    testFramework.it('should include components in XML output', () => {
        const xml = generator.generate();
        
        testFramework.expect(xml).toContain('User Needs');
        testFramework.expect(xml).toContain('Application');
        testFramework.expect(xml).toContain('fillColor=#3498db');
        testFramework.expect(xml).toContain('strokeColor=#2980b9');
    });
    
    testFramework.it('should escape XML special characters', () => {
        components.set('comp3', {
            id: 'comp3',
            name: 'Test & <Component>',
            x: 400,
            y: 300,
            width: 120,
            height: 40
        });
        
        const xml = generator.generate();
        
        testFramework.expect(xml).toContain('Test &amp; &lt;Component&gt;');
        testFramework.expect(xml).not.toContain('Test & <Component>');
    });
    
    testFramework.it('should handle empty components gracefully', () => {
        const emptyGenerator = new DrawIoGenerator(new Map(), new Map(), {});
        const xml = emptyGenerator.generate();
        
        testFramework.expect(xml).toContain('<mxCell id="0"/>');
        testFramework.expect(xml).toContain('<mxCell id="1" parent="0"/>');
        testFramework.expect(xml).toContain('</mxfile>');
    });
});

// Test Suite: Event Handler Integration
testFramework.describe('WardleyMapEngine - Event Handlers', () => {
    let engine;
    
    testFramework.beforeEach(() => {
        DOMTestUtils.setupMockDOM();
        engine = new WardleyMapEngine();
    });
    
    testFramework.afterEach(() => {
        DOMTestUtils.teardownMockDOM();
    });
    
    testFramework.it('should handle canvas click to deselect components', () => {
        const component = engine.addComponent();
        engine.selectComponent(component.id);
        
        testFramework.expect(engine.selectedComponent).toBe(component.id);
        
        const mockEvent = {
            target: engine.svg
        };
        
        engine.handleCanvasClick(mockEvent);
        
        testFramework.expect(engine.selectedComponent).toBe(null);
    });
    
    testFramework.it('should handle add component button click', () => {
        const initialSize = engine.components.size;
        const button = document.getElementById('add-component-btn');
        
        button.click();
        
        testFramework.expect(engine.components.size).toBe(initialSize + 1);
    });
    
    testFramework.it('should handle property input changes', () => {
        const component = engine.addComponent();
        engine.selectComponent(component.id);
        
        const nameInput = document.getElementById('component-name');
        nameInput.value = 'Updated Name';
        nameInput.dispatchEvent(new Event('input'));
        
        testFramework.expect(component.name).toBe('Updated Name');
    });
    
    testFramework.it('should handle export button click', () => {
        const exportSpy = testFramework.spy(engine, 'exportToDrawIo');
        const button = document.getElementById('export-btn');
        
        button.click();
        
        testFramework.expect(exportSpy).toHaveBeenCalled();
        exportSpy.restore();
    });
});

// Test Suite: Error Handling and Edge Cases
testFramework.describe('WardleyMapEngine - Error Handling', () => {
    let engine;
    
    testFramework.beforeEach(() => {
        DOMTestUtils.setupMockDOM();
        engine = new WardleyMapEngine();
    });
    
    testFramework.afterEach(() => {
        DOMTestUtils.teardownMockDOM();
    });
    
    testFramework.it('should handle invalid component selection gracefully', () => {
        engine.selectComponent('nonexistent-id');
        testFramework.expect(engine.selectedComponent).toBe('nonexistent-id');
    });
    
    testFramework.it('should handle property update without selected component', () => {
        engine.selectedComponent = null;
        
        // Should not throw error
        engine.updateComponentProperty('name', 'Test');
        testFramework.expect(engine.selectedComponent).toBe(null);
    });
    
    testFramework.it('should handle delete without selected component', () => {
        engine.selectedComponent = null;
        const initialSize = engine.components.size;
        
        engine.deleteSelectedComponent();
        
        testFramework.expect(engine.components.size).toBe(initialSize);
    });
    
    testFramework.it('should handle malformed localStorage data', () => {
        localStorage.setItem('wardley-map-data', 'invalid-json');
        
        const consoleSpy = testFramework.spy(engine, 'showMessage');
        
        engine.loadMap();
        
        testFramework.expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.restore();
    });
    
    testFramework.it('should handle missing DOM elements gracefully', () => {
        const originalElement = document.getElementById('component-properties');
        originalElement.remove();
        
        // Should not throw error
        engine.selectComponent('any-id');
        testFramework.expect(engine.selectedComponent).toBe('any-id');
    });
});

// Run all tests
testFramework.runTests();