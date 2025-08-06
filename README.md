# Wardley Map Editor

🗺️ **A web-based visual editor for Wardley Maps with draw.io export functionality**

> This project demonstrates Human-AI collaboration in software architecture, created live during a "Software Architecture in Stream" session.

## 🌐 **[➡️ View Project Website](https://raifdmueller.github.io/wardley-map-editor/)**

---

## 🎯 Project Overview

This Wardley Map Editor is a **demo project** showcasing:
- ✅ Rapid architecture documentation with arc42
- ✅ Structured decision making with Architecture Decision Records (ADRs)
- ✅ Human-AI collaborative software design
- ✅ Live architecture development in under 60 minutes

## 🏗️ Architecture

The project follows the [arc42](https://arc42.org) template for architecture documentation and uses Architecture Decision Records (ADRs) for transparent decision tracking.

**📋 [Complete Architecture Documentation](https://raifdmueller.github.io/wardley-map-editor/)** *(generated with docToolchain)*

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Rendering** | SVG over Canvas | Simpler event handling, better debugging |
| **Architecture** | Simple Event Handlers | Minimal complexity for 1-hour implementation |
| **Persistence** | LocalStorage | No server infrastructure needed |
| **Interaction** | Mouse-only | Desktop-focused demo environment |

## 🚀 Features (MVP)

- **Visual Map Creation**: Click to create Wardley Map components
- **Interactive Positioning**: Drag & drop on Evolution/Value axes  
- **draw.io Export**: Generate XML files for further editing
- **Browser Persistence**: LocalStorage saves your work

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript ES6+, HTML5, CSS3
- **Rendering**: SVG for map visualization
- **Storage**: Browser LocalStorage
- **Export**: draw.io XML format
- **Documentation**: arc42 + docToolchain + AsciiDoc

## 📖 Documentation

This project demonstrates professional architecture documentation:

```
docs/
├── arc42/                     # Complete architecture documentation
│   ├── 01_introduction_and_goals.adoc
│   ├── 02_architecture_constraints.adoc
│   ├── 03_system_scope_and_context.adoc
│   ├── 04_solution_strategy.adoc
│   ├── 05_building_block_view.adoc
│   ├── 09_architecture_decisions.adoc
│   ├── 10_quality_requirements.adoc
│   ├── 11_risks_and_technical_debt.adoc
│   ├── 12_glossary.adoc
│   ├── adr-001-svg-rendering.adoc
│   ├── adr-002-architecture-pattern.adoc
│   ├── adr-003-data-persistence.adoc
│   └── adr-004-user-interaction.adoc
```

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/raifdmueller/wardley-map-editor.git
   cd wardley-map-editor
   ```

2. **Generate documentation** (optional)
   ```bash
   # Download dtcw wrapper
   curl -Lo dtcw https://doctoolchain.org/dtcw
   chmod +x dtcw
   
   # Generate HTML documentation
   ./dtcw generateHTML
   ```

3. **Open in browser**
   ```bash
   # For documentation
   open build/docs/html5/arc42.html
   
   # For the app (when implemented)
   open index.html
   ```

## 📺 Live Development

This project was created during a **live-streamed architecture session** demonstrating:

- Real-time Human-AI collaboration
- Structured decision making under time pressure
- Professional architecture documentation practices
- Modern docs-as-code workflows

**Stream Highlights:**
- ⏱️ Complete architecture in 50 minutes
- 🤖 AI-assisted ADR creation with Pugh Matrix evaluation
- 📋 Full arc42 documentation generated live
- 🔄 Iterative refinement based on feedback

## 🎓 Learning Outcomes

**For Architecture Students:**
- See how structured architecture documentation works in practice
- Learn the arc42 template through a real example
- Understand ADR-based decision tracking
- Experience time-constrained architecture decisions

**For AI/Human Collaboration:**
- Observe effective human-AI teamwork patterns
- See AI assisting with structured documentation
- Learn prompt engineering for architecture work
- Understand AI limitations and human oversight needs

## 🤝 Contributing

This is primarily an educational demo project. However, contributions that improve the documentation or add educational value are welcome!

**Areas for Enhancement:**
- Implementation of the actual editor (HTML/CSS/JS)
- Additional architecture views (deployment, runtime)
- Extended ADRs for implementation decisions
- Tutorial content for architecture learning

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **[arc42](https://arc42.org)** - Architecture documentation template
- **[docToolchain](https://doctoolchain.org)** - Docs-as-code toolchain  
- **[Wardley Mapping](https://wardleymaps.com)** - Strategic mapping methodology
- **Software Architecture im Stream** - Live learning community

---

> 💡 **Note**: This project prioritizes **educational value** and **documentation quality** over feature completeness. It serves as a reference for structured architecture work rather than a production-ready tool.
