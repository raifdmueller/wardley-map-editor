/**
 * Simple test runner for Wardley Map Editor
 * Basic validation tests for core functionality
 */

// Simple test framework
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('🧪 Running Wardley Map Editor Tests...\n');
        
        for (const test of this.tests) {
            try {
                await test.fn();
                console.log(`✅ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.error(`❌ ${test.name}: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEquals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }
}

// Import modules for testing
import { WardleyMap } from '../js/models/WardleyMap.js';
import { DrawIOExporter } from '../js/export/DrawIOExporter.js';

// Create test runner
const testRunner = new TestRunner();

// Test WardleyMap model
testRunner.test('WardleyMap - Create empty map', () => {
    const map = new WardleyMap('Test Map');
    testRunner.assertEquals(map.title, 'Test Map');
    testRunner.assertEquals(map.getAllComponents().length, 0);
    testRunner.assertEquals(map.getAllConnections().length, 0);
});

testRunner.test('WardleyMap - Add component', () => {
    const map = new WardleyMap();
    const id = map.addComponent({
        name: 'Test Component',
        x: 100,
        y: 200,
        evolution: 1
    });
    
    testRunner.assert(id, 'Component ID should be returned');
    testRunner.assertEquals(map.getAllComponents().length, 1);
    
    const component = map.getComponent(id);
    testRunner.assertEquals(component.name, 'Test Component');
    testRunner.assertEquals(component.x, 100);
    testRunner.assertEquals(component.y, 200);
    testRunner.assertEquals(component.evolution, 1);
});

testRunner.test('WardleyMap - Add connection', () => {
    const map = new WardleyMap();
    const comp1Id = map.addComponent({ name: 'Component 1' });
    const comp2Id = map.addComponent({ name: 'Component 2' });
    
    const connId = map.addConnection(comp1Id, comp2Id);
    
    testRunner.assert(connId, 'Connection ID should be returned');
    testRunner.assertEquals(map.getAllConnections().length, 1);
    
    const connection = map.getConnection(connId);
    testRunner.assertEquals(connection.fromId, comp1Id);
    testRunner.assertEquals(connection.toId, comp2Id);
});

testRunner.test('WardleyMap - Remove component removes connections', () => {
    const map = new WardleyMap();
    const comp1Id = map.addComponent({ name: 'Component 1' });
    const comp2Id = map.addComponent({ name: 'Component 2' });
    const connId = map.addConnection(comp1Id, comp2Id);
    
    testRunner.assertEquals(map.getAllConnections().length, 1);
    
    map.removeComponent(comp1Id);
    
    testRunner.assertEquals(map.getAllComponents().length, 1);
    testRunner.assertEquals(map.getAllConnections().length, 0);
});

testRunner.test('WardleyMap - Selection management', () => {
    const map = new WardleyMap();
    const comp1Id = map.addComponent({ name: 'Component 1' });
    const comp2Id = map.addComponent({ name: 'Component 2' });
    
    map.selectItem(comp1Id);
    testRunner.assert(map.isSelected(comp1Id));
    testRunner.assertEquals(map.getSelection().length, 1);
    
    map.selectItem(comp2Id);
    testRunner.assertEquals(map.getSelection().length, 2);
    
    map.clearSelection();
    testRunner.assertEquals(map.getSelection().length, 0);
});

testRunner.test('WardleyMap - Export/Import', () => {
    const map = new WardleyMap('Export Test');
    const comp1Id = map.addComponent({ name: 'Test Component', x: 150, y: 250 });
    const comp2Id = map.addComponent({ name: 'Other Component', x: 300, y: 400 });
    map.addConnection(comp1Id, comp2Id);
    
    const exported = map.export();
    
    testRunner.assertEquals(exported.title, 'Export Test');
    testRunner.assertEquals(exported.components.length, 2);
    testRunner.assertEquals(exported.connections.length, 1);
    
    const newMap = new WardleyMap();
    newMap.import(exported);
    
    testRunner.assertEquals(newMap.title, 'Export Test');
    testRunner.assertEquals(newMap.getAllComponents().length, 2);
    testRunner.assertEquals(newMap.getAllConnections().length, 1);
});

testRunner.test('WardleyMap - Validation', () => {
    const map = new WardleyMap();
    const comp1Id = map.addComponent({ name: 'Valid Component' });
    const comp2Id = map.addComponent({ name: '' }); // Invalid: no name
    
    const errors = map.validate();
    testRunner.assert(errors.length > 0, 'Should have validation errors');
    testRunner.assert(errors.some(e => e.includes('no name')), 'Should detect missing name');
});

testRunner.test('DrawIOExporter - Basic export', () => {
    const map = new WardleyMap('Export Test');
    map.addComponent({ 
        name: 'Test Component', 
        x: 100, 
        y: 200, 
        evolution: 2,
        visibility: 0.7 
    });
    
    const exporter = new DrawIOExporter();
    const xml = exporter.export(map);
    
    testRunner.assert(xml.includes('<?xml'), 'Should be valid XML');
    testRunner.assert(xml.includes('Test Component'), 'Should contain component name');
    testRunner.assert(xml.includes('mxGraphModel'), 'Should contain mxGraph structure');
});

testRunner.test('DrawIOExporter - Validation', () => {
    const map = new WardleyMap();
    const exporter = new DrawIOExporter();
    
    const validation = exporter.validateForExport(map);
    testRunner.assert(!validation.valid, 'Empty map should not be valid for export');
    testRunner.assert(validation.errors.length > 0, 'Should have validation errors');
});

testRunner.test('DrawIOExporter - Component conversion', () => {
    const exporter = new DrawIOExporter();
    const component = {
        id: 'component-1',
        name: 'Test Component',
        evolution: 2, // Product stage
        visibility: 0.5
    };
    
    const converted = exporter.convertComponent(component);
    
    testRunner.assertEquals(converted.id, 'comp_1');
    testRunner.assertEquals(converted.value, 'Test Component');
    testRunner.assert(converted.x > 0, 'Should have valid X coordinate');
    testRunner.assert(converted.y > 0, 'Should have valid Y coordinate');
});

testRunner.test('DrawIOExporter - Evolution mapping', () => {
    const exporter = new DrawIOExporter();
    
    testRunner.assertEquals(exporter.evolutionMap[0], 100);   // Genesis
    testRunner.assertEquals(exporter.evolutionMap[1], 300);   // Custom
    testRunner.assertEquals(exporter.evolutionMap[2], 500);   // Product  
    testRunner.assertEquals(exporter.evolutionMap[3], 700);   // Commodity
});

// Run tests when DOM is loaded or in Node.js environment
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        testRunner.run().then(success => {
            if (success) {
                console.log('🎉 All tests passed!');
            } else {
                console.error('💥 Some tests failed!');
            }
        });
    });
} else {
    // Node.js environment
    testRunner.run();
}

export { testRunner };