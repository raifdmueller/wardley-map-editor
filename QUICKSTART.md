# Quick Start Guide

## Setup Documentation Environment

1. **Download docToolchain wrapper**
   ```bash
   curl -Lo dtcw https://doctoolchain.org/dtcw
   chmod +x dtcw
   ```

2. **Install Java (if needed)**
   ```bash
   ./dtcw local install java
   ```

3. **Install docToolchain**
   ```bash
   ./dtcw local install doctoolchain
   ```

## Generate Documentation

### HTML Documentation
```bash
./dtcw generateHTML
```

### View Results
```bash
open build/docs/html5/arc42.html
```

### Generate Site (optional)
```bash
./dtcw generateSite
```

## Development Commands

### Check Task List
```bash
./dtcw tasks --group doctoolchain
```

### Export PlantUML Diagrams
```bash
./dtcw exportDiagrams
```

### Validate Documentation
```bash
./dtcw htmlSanityCheck
```

## Project Structure

```
docs/
├── arc42/                     # Architecture documentation
│   ├── arc42.adoc            # Master document
│   ├── 01_introduction_and_goals.adoc
│   ├── 02_architecture_constraints.adoc
│   ├── 03_system_scope_and_context.adoc
│   ├── 04_solution_strategy.adoc
│   ├── 05_building_block_view.adoc
│   ├── 09_architecture_decisions.adoc
│   ├── 10_quality_requirements.adoc
│   ├── 11_risks_and_technical_debt.adoc
│   ├── 12_glossary.adoc
│   ├── adr-001-svg-rendering.adoc        # Hidden from menu
│   ├── adr-002-architecture-pattern.adoc # Hidden from menu
│   ├── adr-003-data-persistence.adoc     # Hidden from menu
│   └── adr-004-user-interaction.adoc     # Hidden from menu
├── images/                    # Shared images
└── styles/                    # Custom PDF styles
```

## Configuration

- **docToolchainConfig.groovy**: Main configuration
- **ADRs are hidden** from navigation with `:jbake-menu: -`
- **PlantUML diagrams** auto-generated via plantuml.com server
- **HTML theme**: Professional docToolchain template

## Troubleshooting

### Common Issues

1. **"dtcw command not found"**
   ```bash
   # Ensure dtcw is executable
   chmod +x dtcw
   ```

2. **Java version issues**
   ```bash
   # Force Java installation
   ./dtcw local install java
   ```

3. **PlantUML diagrams not rendering**
   ```bash
   # Check internet connection - uses plantuml.com server
   # Or install local PlantUML server
   ```

### Clean Build
```bash
rm -rf build/
./dtcw generateHTML
```

---

**Happy documenting!** 📚✨
