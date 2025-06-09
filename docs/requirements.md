# Requirements Dokument: Wardley-Map Editor

## 1. Projektübersicht

### 1.1 Zweck
Entwicklung eines webbasierten Editors zur Erstellung und Bearbeitung von Wardley Maps mit Export-Funktionalität nach draw.io.

### 1.2 Zielgruppe
- Software-Architekten
- Strategische Planer
- Business Analysten
- Produkt-Manager

### 1.3 Projektziele
- Vereinfachung der Wardley Map Erstellung
- Standardisierte Visualisierung strategischer Landschaften
- Nahtlose Integration mit bestehenden Diagramm-Tools (draw.io)

## 2. Funktionale Anforderungen

### 2.1 Core Editor Funktionen

#### F001: Map Creation
- **Beschreibung**: Benutzer können neue Wardley Maps erstellen
- **Akzeptanzkriterien**:
  - Neue Map mit Standard-Achsen (Genesis-Custom, Visible-Invisible)
  - Titel und Beschreibung hinzufügbar
  - Standard-Template verfügbar

#### F002: Component Management
- **Beschreibung**: Hinzufügen, Bearbeiten und Löschen von Komponenten
- **Akzeptanzkriterien**:
  - Komponenten per Drag & Drop platzierbar
  - Evolution-Position auf X-Achse einstellbar
  - Visibility-Position auf Y-Achse einstellbar
  - Komponenten-Labels editierbar
  - Komponenten löschbar

#### F003: Dependency Visualization
- **Beschreibung**: Darstellung von Abhängigkeiten zwischen Komponenten
- **Akzeptanzkriterien**:
  - Verbindungen zwischen Komponenten zeichenbar
  - Pfeile zeigen Abhängigkeitsrichtung
  - Verbindungen editierbar und löschbar

#### F004: Value Chain Mapping
- **Beschreibung**: Komponenten können entlang der Value Chain organisiert werden
- **Akzeptanzkriterien**:
  - Vertikale Anordnung nach User-Nähe
  - Visuelle Gruppierung verwandter Komponenten

### 2.2 Import/Export Funktionen

#### F005: Wardley Map DSL Input
- **Beschreibung**: Import von Maps über Wardley Map Domain Specific Language
- **Akzeptanzkriterien**:
  - Textbasierte Eingabe von Map-Definitionen
  - Parser für Standard Wardley Map Syntax
  - Fehlerbehandlung bei invalid syntax

#### F006: draw.io Export
- **Beschreibung**: Export der erstellten Map als draw.io kompatible Datei
- **Akzeptanzkriterien**:
  - Generierung von draw.io XML Format
  - Beibehaltung der visuellen Struktur
  - Komponenten als Shapes exportiert
  - Verbindungen als Connectors exportiert
  - Exportierte Datei in draw.io öffenbar

#### F007: Native Format Persistence
- **Beschreibung**: Speichern und Laden von Maps in eigenem Format
- **Akzeptanzkriterien**:
  - JSON-basiertes Speicherformat
  - Vollständige Map-Information erhalten
  - Versionierung der Speicherformate

### 2.3 Benutzerinterface

#### F008: Visual Editor
- **Beschreibung**: Grafische Benutzeroberfläche für Map-Erstellung
- **Akzeptanzkriterien**:
  - Canvas-basierte Darstellung
  - Zoom- und Pan-Funktionalität
  - Grid/Raster für Ausrichtung
  - Responsive Design

#### F009: Properties Panel
- **Beschreibung**: Seitenpanel für Komponenten- und Map-Eigenschaften
- **Akzeptanzkriterien**:
  - Editierbare Komponenten-Details
  - Map-Metadaten (Titel, Autor, Datum)
  - Component-Styling Optionen

## 3. Nicht-Funktionale Anforderungen

### 3.1 Performance
- **P001**: Map-Rendering unter 500ms für Maps mit bis zu 100 Komponenten
- **P002**: Export-Generierung unter 2 Sekunden

### 3.2 Usability
- **U001**: Intuitive Bedienung ohne Tutorial für Wardley Map-erfahrene Nutzer
- **U002**: Tooltips und Hilfe-System für Einsteiger

### 3.3 Kompatibilität
- **K001**: Unterstützung moderner Browser (Chrome 90+, Firefox 88+, Safari 14+)
- **K002**: draw.io Kompatibilität für Standard-Shapes

### 3.4 Technische Anforderungen
- **T001**: Client-side Implementierung (keine Server-Abhängigkeit)
- **T002**: Offline-Funktionalität für Basis-Features

## 4. Technische Constraints

### 4.1 Technologie-Stack
- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Canvas-Rendering oder SVG-basiert
- Keine externen Server-Dependencies für Core-Funktionalität

### 4.2 Data Formats
- **Input**: Wardley Map DSL (text-basiert)
- **Storage**: JSON
- **Output**: draw.io XML Format

### 4.3 Browser Support
- Moderne Browser mit Canvas/SVG Support
- Local Storage für Persistence

## 5. User Stories

### Epic 1: Map Creation
```
Als Software-Architekt
möchte ich eine neue Wardley Map erstellen
damit ich strategische Entscheidungen visualisieren kann
```

### Epic 2: Component Management
```
Als Benutzer
möchte ich Komponenten per Drag & Drop positionieren
damit ich schnell Maps erstellen kann
```

### Epic 3: Export Integration
```
Als Consultant
möchte ich meine Wardley Map nach draw.io exportieren
damit ich sie in Präsentationen verwenden kann
```

## 6. Akzeptanzkriterien Minimum Viable Product (MVP)

Für die Live-Session am 13.6. fokussieren wir auf:

### Must-Have:
- [ ] Basis-Canvas mit Wardley Map Achsen
- [ ] Komponenten manuell hinzufügen/positionieren
- [ ] Einfache Verbindungen zwischen Komponenten
- [ ] draw.io XML Export einer simplen Map

### Should-Have:
- [ ] DSL Parser für Textinput
- [ ] Lokale Speicherung
- [ ] Basis-Styling der Komponenten

### Could-Have:
- [ ] Advanced Benutzerinterface
- [ ] Umfangreiche Validierung
- [ ] Multiple Map Management

## 7. Risiken und Annahmen

### Risiken:
- draw.io XML Format-Kompatibilität könnte komplex sein
- Eine Stunde könnte für vollständige Implementierung knapp werden
- Browser-spezifische Canvas/SVG Rendering-Unterschiede

### Annahmen:
- Benutzer haben Grundkenntnisse in Wardley Mapping
- draw.io XML Format ist ausreichend dokumentiert
- Client-side Implementierung ist ausreichend für MVP

## 8. Success Metrics

### Technische Metrics:
- Funktionsfähiger Prototyp am Ende der Session
- Erfolgreicher Export mindestens einer Map nach draw.io
- Code-Struktur ermöglicht weitere Entwicklung

### Demonstration Metrics:
- Live-Demo zeigt vollständigen Workflow (Create → Edit → Export)
- Publikum kann Architektur-Entscheidungen nachvollziehen
- "Architektur-Theater" wird zu echter Wertschöpfung