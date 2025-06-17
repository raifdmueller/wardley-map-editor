// MapEngine Test Suite
// Führe Tests nur aus wenn test=true Parameter gesetzt ist
if (window.location.search.includes('test=true')) {
    
    // Test Suite für MapEngine
    const mapEngineTests = [
        {
            description: 'MapEngine constructor should create empty map with default properties',
            test: function() {
                const mapEngine = new MapEngine();
                
                assertArray(mapEngine.components, 'components should be an array');
                assertEmpty(mapEngine.components, 'components should be empty');
                
                assertArray(mapEngine.dependencies, 'dependencies should be an array');
                assertEmpty(mapEngine.dependencies, 'dependencies should be empty');
                
                assertEqual(mapEngine.title, 'Untitled Map', 'title should be "Untitled Map"');
                
                // Zusätzliche Properties prüfen
                assert(typeof mapEngine.id === 'string', 'id should be a string');
                assert(mapEngine.id.length > 0, 'id should not be empty');
                assert(typeof mapEngine.lastModified === 'string', 'lastModified should be a string');
            }
        }
    ];
    
    // Test Suite ausführen
    runTestSuite('MapEngine', mapEngineTests);
}