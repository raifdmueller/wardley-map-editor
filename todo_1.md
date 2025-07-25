# TODO Phase 1: Grundgerüst (20 Min)

## 1.1 HTML-Struktur erstellen

### 1.1.1 Basis HTML-Datei
- [x] Erstelle `index.html` mit DOCTYPE html5
- [x] Füge `<head>` mit meta charset UTF-8 hinzu
- [x] Füge viewport meta tag für responsive design hinzu
- [x] Setze title auf "Wardley Map Editor"
- [x] Verlinke CSS-Datei `css/style.css`
- [x] Verlinke JavaScript-Dateien in korrekter Reihenfolge

### 1.1.2 SVG-Canvas Container
- [x] Erstelle `<main>` Element als Haupt-Container
- [x] Füge `<div id="canvas-container">` für SVG-Wrapper hinzu
- [x] Erstelle `<svg id="wardley-canvas">` mit viewBox="0 0 1200 800"
- [x] Definiere SVG-Gruppen: `<g id="axes">`, `<g id="components">`, `<g id="dependencies">`

### 1.1.3 Toolbar-Elemente
- [x] Erstelle `<header>` mit `<nav class="toolbar">`
- [x] Füge Button "New Map" mit id="btn-new" hinzu
- [x] Füge Button "Save Map" mit id="btn-save" hinzu
- [x] Füge Button "Load Map" mit id="btn-load" hinzu
- [x] Füge Button "Export to draw.io" mit id="btn-export" hinzu
- [x] Füge verstecktes `<input type="file" id="file-input">` für Map-Import hinzu

### 1.1.4 Achsen-Beschriftung
- [x] Füge Evolution-Achse als `<line>` mit x1="100" y1="700" x2="1100" y2="700"
- [x] Füge Visibility-Achse als `<line>` mit x1="100" y1="100" x2="100" y2="700"
- [x] Erstelle `<text>` Labels für Evolution: "Genesis", "Custom", "Product", "Commodity"
- [x] Erstelle `<text>` Labels für Visibility: "Invisible" (unten), "Visible" (oben)
- [x] Positioniere Evolution-Labels bei x=200,400,600,800 y=720
- [x] Positioniere Visibility-Labels bei x=80 y=650,150

## 1.2 CSS-Layout implementieren

### 1.2.1 Reset und Basis-Styles
- [x] Erstelle `css/style.css` Datei
- [x] Füge CSS reset hinzu: `* { margin: 0; padding: 0; box-sizing: border-box; }`
- [x] Setze body font-family auf "Arial, sans-serif"
- [x] Definiere CSS-Variablen für Farben: --primary-color, --secondary-color, --background-color

### 1.2.2 Layout-Container
- [x] Style main container: `main { width: 100vw; height: 100vh; display: flex; flex-direction: column; }`
- [x] Style canvas-container: `#canvas-container { flex: 1; overflow: hidden; }`
- [x] Style SVG: `#wardley-canvas { width: 100%; height: 100%; border: 1px solid #ccc; }`

### 1.2.3 Toolbar-Styling
- [x] Style toolbar: `.toolbar { background: #f5f5f5; padding: 10px; display: flex; gap: 10px; }`
- [x] Style buttons: `.toolbar button { padding: 8px 16px; border: 1px solid #ccc; background: white; cursor: pointer; }`
- [x] Füge hover-Effekte hinzu: `.toolbar button:hover { background: #e9e9e9; }`

### 1.2.4 Wardley Map spezifische Styles
- [x] Style Achsen: `.axis { stroke: #333; stroke-width: 2; }`
- [x] Style Achsen-Labels: `.axis-label { font-size: 12px; fill: #666; text-anchor: middle; }`
- [x] Style für Komponenten: `.component { fill: #e1d5e7; stroke: #9673a6; stroke-width: 2; cursor: move; }`
- [x] Style für Komponenten-Text: `.component-label { font-size: 11px; text-anchor: middle; pointer-events: none; }`

### 1.2.5 Responsive Design
- [x] Füge media query für mobile hinzu: `@media (max-width: 768px)`
- [x] Reduziere toolbar button padding auf mobilen Geräten
- [x] Passe SVG viewBox für kleinere Bildschirme an

## 1.3 JavaScript-Module Setup

### 1.3.1 MapEngine-Klasse - Test First (TDD)
- [x] Erstelle `js/mapEngine.test.js` Test-Datei
- [x] Schreibe Test: "should create empty map with default properties"
- [x] Führe Test aus und prüfe, dass er fehlschlägt
- [x] Erstelle `js/mapEngine.js` mit MapEngine-Klasse
- [x] Implementiere constructor mit properties: components=[], dependencies=[], title="Untitled Map"
- [x] Führe Test aus und prüfe, dass er erfolgreich ist

### 1.3.2 MapEngine addComponent Methode - Test First
- [x] Schreibe Test: "should add component with unique ID"
- [x] Schreibe Test: "should validate component position (x,y between 0-1)"
- [x] Führe Tests aus und prüfe, dass sie fehlschlagen
- [x] Implementiere `addComponent(label, x, y)` Methode
- [x] Generiere unique ID mit `crypto.randomUUID()`
- [x] Validiere x,y Koordinaten (0-1 Range)
- [x] Führe Tests aus und prüfe, dass sie erfolgreich sind

### 1.3.3 MapEngine removeComponent Methode - Test First
- [x] Schreibe Test: "should remove component by ID"
- [x] Schreibe Test: "should remove associated dependencies when component removed"
- [x] Führe Tests aus und prüfe, dass sie fehlschlagen
- [x] Implementiere `removeComponent(id)` Methode
- [x] Entferne component aus components array
- [x] Entferne alle dependencies die component referenzieren
- [x] Führe Tests aus und prüfe, dass sie erfolgreich sind

### 1.3.4 EventHandler-Klasse - Test First
- [x] Erstelle `js/eventHandler.test.js` Test-Datei
- [x] Schreibe Test: "should initialize with SVG canvas reference"
- [x] Führe Test aus und prüfe, dass er fehlschlägt
- [x] Erstelle `js/eventHandler.js` mit EventHandler-Klasse
- [x] Implementiere constructor mit canvas parameter
- [x] Speichere canvas reference als this.canvas
- [x] Führe Test aus und prüfe, dass er erfolgreich ist

### 1.3.5 EventHandler attachListeners Methode - Test First
- [x] Schreibe Test: "should attach click listener to canvas"
- [x] Schreibe Test: "should call mapEngine.addComponent on canvas click"
- [x] Führe Tests aus und prüfe, dass sie fehlschlagen
- [x] Implementiere `attachListeners(mapEngine)` Methode
- [x] Füge canvas click event listener hinzu
- [x] Berechne relative Koordinaten aus mouse event
- [x] Rufe mapEngine.addComponent auf mit berechneten Koordinaten
- [x] Führe Tests aus und prüfe, dass sie erfolgreich sind

### 1.3.6 StorageManager-Klasse - Test First
- [x] Erstelle `js/storageManager.test.js` Test-Datei
- [x] Schreibe Test: "should save map data to localStorage"
- [x] Schreibe Test: "should load map data from localStorage"
- [x] Führe Tests aus und prüfe, dass sie fehlschlagen
- [x] Erstelle `js/storageManager.js` mit StorageManager-Klasse
- [x] Implementiere `saveMap(mapData)` mit localStorage.setItem
- [x] Implementiere `loadMap()` mit localStorage.getItem und JSON.parse
- [x] Führe Tests aus und prüfe, dass sie erfolgreich sind

## 1.4 LocalStorage-Integration

### 1.4.1 JSON-Serialisierung Tests
- [x] Schreibe Test: "should serialize complete map data to JSON"
- [x] Schreibe Test: "should handle empty components array"
- [x] Schreibe Test: "should include metadata (title, lastModified)"
- [x] Führe Tests aus und prüfe, dass sie fehlschlagen

### 1.4.2 JSON-Serialisierung Implementation
- [x] Implementiere `toJSON()` Methode in MapEngine
- [x] Erstelle Datenstruktur: `{ id, title, components, dependencies, lastModified }`
- [x] Verwende `JSON.stringify()` für Serialisierung
- [x] Führe Tests aus und prüfe, dass sie erfolgreich sind

### 1.4.3 JSON-Deserialisierung Tests
- [x] Schreibe Test: "should deserialize JSON to MapEngine instance"
- [x] Schreibe Test: "should handle invalid JSON gracefully"
- [x] Schreibe Test: "should restore all components and dependencies"
- [x] Führe Tests aus und prüfe, dass sie fehlschlagen

### 1.4.4 JSON-Deserialisierung Implementation
- [x] Implementiere `fromJSON(jsonString)` static Methode in MapEngine
- [x] Parse JSON mit try/catch error handling
- [x] Erstelle neue MapEngine Instanz mit parsed data
- [x] Validiere geladene Datenstruktur
- [x] Führe Tests aus und prüfe, dass sie erfolgreich sind

### 1.4.5 Auto-Save Funktionalität Tests
- [x] Schreibe Test: "should auto-save after component changes"
- [x] Schreibe Test: "should debounce rapid changes"
- [x] Führe Tests aus und prüfe, dass sie fehlschlagen

### 1.4.6 Auto-Save Implementation
- [x] Implementiere `enableAutoSave()` Methode in MapEngine
- [x] Verwende `setTimeout` für debouncing (500ms delay)
- [x] Rufe StorageManager.saveMap automatisch auf bei Änderungen
- [x] Führe Tests aus und prüfe, dass sie erfolgreich sind

## 1.5 Integration und Basis-Tests

### 1.5.1 Haupt-App Integration Test
- [x] Erstelle `js/app.test.js` für Integration Tests
- [x] Schreibe Test: "should initialize all modules successfully"
- [x] Schreibe Test: "should create component on canvas click"
- [x] Führe Tests aus und prüfe, dass sie fehlschlagen

### 1.5.2 Haupt-App Implementation
- [x] Erstelle `js/app.js` als main entry point
- [x] Initialisiere MapEngine Instanz
- [x] Initialisiere EventHandler mit SVG canvas
- [x] Initialisiere StorageManager
- [x] Verbinde alle Module miteinander
- [x] Führe Tests aus und prüfe, dass sie erfolgreich sind

### 1.5.3 Browser-Test Setup
- [x] Öffne `index.html` im Browser
- [x] Prüfe, dass SVG Canvas korrekt dargestellt wird
- [x] Prüfe, dass Achsen und Labels sichtbar sind
- [x] Prüfe, dass Toolbar Buttons funktional sind
- [x] Prüfe Console auf JavaScript Fehler

### 1.5.4 End-to-End Test
- [x] Klicke auf Canvas und prüfe, ob Komponente erstellt wird
- [x] Prüfe, ob Komponente in browser dev tools im SVG DOM sichtbar ist
- [x] Prüfe, ob Map-Daten in localStorage gespeichert werden
- [x] Lade Seite neu und prüfe, ob Map wiederhergestellt wird

## Deliverables Phase 1

Nach Abschluss aller TODO Items sollten folgende Ergebnisse vorliegen:

- [x] **Funktionsfähige HTML-Struktur** mit SVG Canvas und Toolbar
- [x] **Vollständiges CSS-Layout** für Wardley Map Darstellung  
- [x] **Getestete JavaScript-Module** (MapEngine, EventHandler, StorageManager)
- [x] **LocalStorage-Integration** mit JSON Serialisierung
- [x] **Basis-Funktionalität** für Komponenten-Erstellung per Mausklick
- [x] **Auto-Save** Mechanismus für Map-Änderungen
- [x] **Browser-kompatible** Implementation (Chrome, Firefox, Safari)
