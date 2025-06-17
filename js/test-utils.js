/**
 * Einfaches Test-Framework für Vanilla JavaScript
 * Für TDD in Browser-Umgebung optimiert
 */

// Test-Runner
function test(description, testFunction) {
    try {
        testFunction();
        console.log(`✅ ${description}`);
        return true;
    } catch (error) {
        console.error(`❌ ${description}`);
        console.error(`   Error: ${error.message}`);
        return false;
    }
}

// Basis-Assertions
function assert(condition, message = 'Assertion failed') {
    if (!condition) {
        throw new Error(message);
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        const msg = message || `Expected ${expected}, but got ${actual}`;
        throw new Error(msg);
    }
}

function assertArray(value, message = 'Expected value to be an array') {
    if (!Array.isArray(value)) {
        throw new Error(message);
    }
}

function assertEmpty(array, message = 'Expected array to be empty') {
    assertArray(array);
    if (array.length !== 0) {
        throw new Error(message);
    }
}

// Test-Suite Runner
function runTestSuite(suiteName, tests) {
    console.group(`🧪 Test Suite: ${suiteName}`);
    
    let passed = 0;
    let failed = 0;
    
    tests.forEach(testCase => {
        if (test(testCase.description, testCase.test)) {
            passed++;
        } else {
            failed++;
        }
    });
    
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
    console.groupEnd();
    
    return { passed, failed };
}

// Globale Test-Funktionen verfügbar machen
window.test = test;
window.assert = assert;
window.assertEqual = assertEqual;
window.assertArray = assertArray;
window.assertEmpty = assertEmpty;
window.runTestSuite = runTestSuite;