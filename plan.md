# Implementierungsplan für Wardley Map Editor

Basierend auf der umfassenden Architektur-Spezifikation in `docs/` erstellt für die schrittweise Umsetzung des Wardley Map Editors.

## Überblick

**Projektziel:** Webbasierter Wardley Map Editor mit draw.io Export-Funktionalität  
**Zeitrahmen:** ~75 Minuten für MVP-Implementation  
**Technologie-Stack:** Vanilla JavaScript, HTML5, CSS3, SVG  

## Phase 1: Grundgerüst (20 Min)

### 1.1 HTML-Struktur erstellen
- **Haupt-Container** mit SVG-Canvas für Wardley Map
- **Toolbar** für Aktionen (Save, Load, Export)
- **Achsen-Beschriftung** (Evolution: Genesis→Custom→Product→Commodity, Visibility: Invisible→Visible)

### 1.2 CSS-Layout implementieren
- **Wardley Map Styling** mit korrekten Proportionen
- **Responsive Design** für verschiedene Bildschirmgrößen
- **Grid-System** für Komponentenausrichtung

### 1.3 JavaScript-Module Setup
- **MapEngine-Klasse** für Datenmanagement
- **EventHandler-Klasse** für User-Interaktionen
- **StorageManager-Klasse** für LocalStorage-Operations

### 1.4 LocalStorage-Integration
- **JSON-Serialisierung** für Map-Daten
- **Save/Load-Funktionen** implementieren
- **Datenstruktur** definieren (Components, Dependencies, Metadata)

## Phase 2: Core-Funktionalität (30 Min)

### 2.1 Komponenten-Erstellung
- **Mausklick-Handler** für neue Komponenten auf Canvas
- **Component-Objekt** mit Label, Position (x/y), Evolution-Stage
- **SVG-Rendering** für Komponenten als Rechtecke mit Text

### 2.2 Drag & Drop-System
- **Mouse-Event-Handler** (mousedown, mousemove, mouseup)
- **Koordinaten-Berechnung** relativ zum SVG-Container
- **Visuelles Feedback** während Drag-Operation

### 2.3 Koordinaten-Transformation
- **Wardley→Pixel-Konversion** für Display
- **Pixel→Wardley-Konversion** für Datenmodell
- **Evolution-Stages-Mapping** (Genesis=0.1, Custom=0.3, Product=0.7, Commodity=0.9)
- **Visibility-Mapping** (Invisible=0.1, Visible=0.9)

### 2.4 Abhängigkeiten visualisieren
- **Verbindungslinien** zwischen Komponenten
- **Click-Handler** für Dependency-Erstellung
- **SVG-Linien** mit Pfeilspitzen für Richtung

## Phase 3: Export-Funktionalität (15 Min)

### 3.1 draw.io XML-Generator
- **Template-basierter Ansatz** für XML-Generierung
- **mxGraph-Format** Implementation
- **Shape-Konvertierung** von Wardley-Komponenten zu draw.io-Shapes

### 3.2 Koordinaten-Mapping
- **Evolution-Stages** zu fixen X-Koordinaten (Genesis=100px, Custom=250px, etc.)
- **Visibility** zu Y-Koordinaten (invertiert: Visible=100px, Invisible=400px)
- **Proportionale Skalierung** für verschiedene Canvas-Größen

### 3.3 Download-Funktionalität
- **XML-String-Generierung** aus Map-Daten
- **Blob-Erstellung** für File-Download
- **Filename-Generierung** mit Timestamp

### 3.4 Validierung
- **XML-Parsing-Test** mit DOMParser
- **mxGraph-Struktur-Validation** (required elements)
- **Error-Handling** für Export-Fehler

## Phase 4: Testing & Demo-Vorbereitung (10 Min)

### 4.1 Funktionstest
- **End-to-End-Test** aller Core-Features
- **Browser-Kompatibilität** (Chrome, Firefox, Safari)
- **Performance-Check** mit 10-20 Komponenten

### 4.2 draw.io Import-Test
- **XML-Import** in draw.io testen
- **Visuelle Korrektheit** der exportierten Maps
- **Editierbarkeit** in draw.io verifizieren

### 4.3 Code-Aufräumung
- **Kommentare** für Live-Demo hinzufügen
- **Console.log** Statements für Debugging
- **Code-Struktur** für bessere Lesbarkeit optimieren

## Technische Entscheidungen (aus ADRs)

### ADR-001: SVG-Rendering
- **Vorteil:** Bessere Event-Behandlung und DOM-Inspektion
- **Implementierung:** Direkte SVG-Manipulation statt Canvas

### ADR-002: Simple Event Handlers
- **Vorteil:** Minimaler Code-Overhead, schnelle Implementierung
- **Implementierung:** Direkte addEventListener() ohne Framework

### ADR-003: LocalStorage Persistierung
- **Vorteil:** Client-side, keine Server-Dependencies
- **Implementierung:** JSON.stringify/parse für Map-Daten

### ADR-004: Mouse-only Interaktion
- **Vorteil:** Einfache Event-Behandlung, Desktop-fokussiert
- **Implementierung:** mousedown/mousemove/mouseup Events

## MVP-Features (Must-Have)

- [x] **Basis-Canvas** mit Wardley Map Achsen
- [x] **Komponenten hinzufügen** per Mausklick
- [x] **Drag & Drop** für Komponentenpositionierung
- [x] **Einfache Verbindungen** zwischen Komponenten
- [x] **draw.io XML Export** funktionsfähig
- [x] **Lokale Speicherung** in LocalStorage

## Nice-to-Have Features (Zeit permitting)

- [ ] **DSL Parser** für Text-Input von Maps
- [ ] **Komponenten-Eigenschaften** editieren
- [ ] **Map-Metadaten** (Titel, Autor, Beschreibung)
- [ ] **Undo/Redo-Funktionalität**
- [ ] **Zoom/Pan** im Canvas
- [ ] **Grid-Snapping** für Komponenten

## Dateistruktur

```
/
├── index.html              # Haupt-HTML-Datei
├── css/
│   └── style.css          # Styling für Wardley Map UI
├── js/
│   ├── mapEngine.js       # Core Map-Logik
│   ├── eventHandler.js    # User-Interaktionen
│   ├── storageManager.js  # LocalStorage-Operations
│   ├── exportEngine.js    # draw.io XML-Generation
│   └── app.js            # Main Application Logic
└── docs/                  # Bestehende Architektur-Dokumentation
```

## Success Metrics

### Technische Erfolgs-Kriterien
- [x] **Funktionsfähiger Prototyp** am Ende der Session
- [x] **draw.io Import** mindestens einer Map erfolgreich
- [x] **Code-Struktur** ermöglicht weitere Entwicklung

### Demo-Erfolgs-Kriterien  
- [x] **Live-Demo** zeigt vollständigen Workflow (Create → Edit → Export)
- [x] **Architektur-Entscheidungen** nachvollziehbar für Publikum
- [x] **Wartbare Code-Basis** für Future Development

## Risiken & Mitigation

### Zeit-Risiken
- **Risiko:** Komplexe draw.io XML-Format Implementation
- **Mitigation:** Template-basierter Ansatz, vorgefertigte Beispiele

### Technische Risiken
- **Risiko:** Browser-spezifische SVG-Rendering-Unterschiede
- **Mitigation:** Standard-SVG-Features verwenden, einfache Shapes

### Demo-Risiken
- **Risiko:** Live-Coding Fehler während Stream
- **Mitigation:** Schrittweise Implementation mit funktionsfähigen Zwischenständen