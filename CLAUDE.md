# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Wardley Map Editor** - a documentation-driven educational demo project showcasing Human-AI collaboration in software architecture. The project demonstrates structured architecture documentation using arc42 and was created during a live-streamed session.

**Current Status**: Architecture-complete, implementation-pending. The comprehensive architecture documentation exists, but the actual web application code is not yet implemented.

## Technology Stack

### Documentation (Current Implementation)
- **docToolchain** - Primary build system using Gradle wrapper
- **AsciiDoc** - Documentation markup language 
- **arc42** - Architecture documentation template
- **jBake** - Static site generation for landing pages
- **PlantUML** - Diagram generation via plantuml.com server

### Planned Application Stack (Not Yet Implemented)
- **Frontend**: Vanilla JavaScript ES6+, HTML5, CSS3
- **Rendering**: SVG for map visualization
- **Storage**: Browser LocalStorage  
- **Export**: draw.io XML format
- **Architecture**: Simple event handlers (no frameworks)

## Development Commands

### Documentation Generation
```bash
# Primary documentation build
./dtcw generateHTML

# View generated documentation  
open build/docs/html5/arc42.html

# Generate website with landing page
./dtcw generateSite

# View available tasks
./dtcw tasks --group doctoolchain

# Export PlantUML diagrams
./dtcw exportDiagrams

# Validate documentation quality
./dtcw htmlSanityCheck
```

### Setup (if needed)
```bash
# Make docToolchain wrapper executable
chmod +x dtcw

# Install dependencies (Java auto-installed if needed)
./dtcw local install java
./dtcw local install doctoolchain
```

## Project Architecture

### Documentation Structure
```
docs/
├── arc42/                          # Complete architecture documentation
│   ├── arc42.adoc                  # Master document
│   ├── 01_introduction_and_goals.adoc
│   ├── 02_architecture_constraints.adoc  
│   ├── 03_system_scope_and_context.adoc
│   ├── 04_solution_strategy.adoc
│   ├── 05_building_block_view.adoc
│   ├── 09_architecture_decisions.adoc
│   ├── 10_quality_requirements.adoc
│   ├── 11_risks_and_technical_debt.adoc
│   ├── 12_glossary.adoc
│   ├── adr-001-svg-rendering.adoc       # Hidden ADRs
│   ├── adr-002-architecture-pattern.adoc
│   ├── adr-003-data-persistence.adoc
│   └── adr-004-user-interaction.adoc
├── landingpage.gsp                 # Website template
└── requirements.md
```

### Key Architectural Decisions (from ADRs)
- **SVG Rendering** over Canvas (faster development, better debugging)
- **Simple Event Handlers** over frameworks (60-minute implementation constraint) 
- **LocalStorage** for data persistence (no server infrastructure)
- **Mouse-only interaction** (desktop-focused demo)

### Implementation Strategy
The project was designed for rapid implementation in phases:
1. Basic HTML/CSS/SVG structure (10 min)
2. Component creation and drag & drop (10 min)
3. draw.io XML export (5 min)

## Configuration Notes

- **ADRs are hidden** from navigation using `:jbake-menu: -`
- **PlantUML diagrams** auto-generated via plantuml.com server
- **Professional docToolchain theme** used for HTML output
- **German language** used for all documentation content

## Architecture Documentation Focus

This project prioritizes **educational value** and **documentation quality** over feature completeness. When working with this codebase:

1. **Read the architecture documentation first** - it contains the complete design
2. **Follow the documented ADRs** - technical decisions are well-reasoned and documented
3. **Maintain documentation-code consistency** - update docs when implementing features
4. **Preserve the educational demo nature** - avoid over-engineering

The project serves as a reference for structured architecture work and Human-AI collaboration rather than a production-ready tool.