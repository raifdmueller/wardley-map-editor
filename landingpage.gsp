<div class="row flex-xl-nowrap">
    <main class="col-12 col-md-12 col-xl-12 pl-md-12" role="main">
        <!-- Hero Section -->
        <div class="bg-primary text-white p-5 rounded mb-4">
            <div class="row align-items-center">
                <div class="col-lg-8">
                    <h1 class="display-4 fw-bold">🗺️ Wardley Map Editor</h1>
                    <p class="lead mb-4">
                        Professionelles strategisches Mapping-Tool mit KI-gestützter Architekturdokumentation
                    </p>
                    <p class="fs-5 mb-4">
                        Erstellen, visualisieren und exportieren Sie Wardley Maps mit nahtloser draw.io-Integration. 
                        Entwickelt durch <strong>Mensch-KI-Kollaboration</strong> und dokumentiert nach arc42-Best-Practices.
                    </p>
                    <div class="d-flex gap-3">
                        <a href="arc42/arc42.html" class="btn btn-light btn-lg">📋 Architektur ansehen</a>
                        <a href="https://github.com/raifdmueller/wardley-map-editor" class="btn btn-outline-light btn-lg">
                            <i class="fab fa-github"></i> GitHub Repository
                        </a>
                    </div>
                </div>
                <div class="col-lg-4">
                    <!-- Responsive YouTube Video -->
                    <div class="ratio ratio-16x9 rounded overflow-hidden shadow-lg">
                        <iframe 
                            src="https://www.youtube.com/embed/WD_3w1nne8M" 
                            title="Software Architektur im Stream - Wardley Map Editor Live Demo"
                            allowfullscreen
                            style="border: 3px solid rgba(255,255,255,0.2);">
                        </iframe>
                    </div>
                    <div class="text-center mt-3">
                        <small class="text-white-75">
                            <strong>Live Demo Session</strong><br>
                            50 Min. vollständige Architektur-Entwicklung
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Key Features Cards -->
        <div class="row row-cols-1 row-cols-md-3 mb-5 text-center">
            <div class="col">
                <div class="card mb-4 shadow-sm h-100">
                    <div class="card-header bg-success text-white">
                        <h4 class="my-0 fw-normal">🎯 Demo-fokussierte Architektur</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <p class="flex-grow-1">
                            Entwickelt für Live-Präsentationen mit realistischen Qualitätszielen: 
                            <strong>Demo-bereit in 1 Stunde</strong>, verständlich für Zuschauer, 
                            maximaler Lernwert für KI-Kollaboration.
                        </p>
                        <small class="text-muted">Qualitätsziel #1</small>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card mb-4 shadow-sm h-100">
                    <div class="card-header bg-info text-white">
                        <h4 class="my-0 fw-normal">🤖 KI-Mensch-Kollaboration</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <p class="flex-grow-1">
                            Demonstriert Echtzeit-Zusammenarbeit zwischen menschlicher Expertise und KI-Unterstützung. 
                            <strong>4 Architekturentscheidungen</strong> erstellt mit strukturierter Pugh-Matrix-Bewertung.
                        </p>
                        <small class="text-muted">Bildungswert</small>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card mb-4 shadow-sm h-100">
                    <div class="card-header bg-warning text-dark">
                        <h4 class="my-0 fw-normal">📐 Professionelle Dokumentation</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <p class="flex-grow-1">
                            Vollständige <strong>arc42-Dokumentation</strong> mit allen 12 Kapiteln, 
                            PlantUML-Diagrammen und docToolchain-Integration. 
                            Bereit für Produktionsumgebungen.
                        </p>
                        <small class="text-muted">Dokumentationsqualität</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Technology Showcase -->
        <div class="row mb-5">
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">🛠️ Technologie-Stack</h4>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            <li class="mb-2"><strong>Frontend:</strong> Vanilla JavaScript ES6+, HTML5, CSS3</li>
                            <li class="mb-2"><strong>Rendering:</strong> SVG für Map-Visualisierung</li>
                            <li class="mb-2"><strong>Speicherung:</strong> Browser LocalStorage</li>
                            <li class="mb-2"><strong>Export:</strong> draw.io XML-Format</li>
                            <li class="mb-2"><strong>Dokumentation:</strong> arc42 + docToolchain + AsciiDoc</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">🎓 Lernergebnisse</h4>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            <li class="mb-2">✅ Strukturierte Architekturdokumentations-Praktiken</li>
                            <li class="mb-2">✅ KI-unterstützte Software-Design-Workflows</li>
                            <li class="mb-2">✅ Architecture Decision Records (ADRs) mit Pugh-Matrix</li>
                            <li class="mb-2">✅ arc42-Template-Implementierung</li>
                            <li class="mb-2">✅ docs-as-code Methodologie</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Architecture Decisions Preview -->
        <div class="bg-light p-4 rounded mb-5">
            <h3 class="mb-4">📋 Wichtige Architekturentscheidungen</h3>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="card border-success">
                        <div class="card-body">
                            <h6 class="card-title text-success">ADR-001: SVG vs Canvas</h6>
                            <p class="card-text small">SVG gewählt für einfachere Event-Behandlung und bessere Debug-Möglichkeiten im Demo-Kontext.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card border-info">
                        <div class="card-body">
                            <h6 class="card-title text-info">ADR-002: Einfache Event-Handler</h6>
                            <p class="card-text small">Keine Frameworks erforderlich - direktes JavaScript für 1-Stunden-Implementierungs-Timeline.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center">
                <a href="arc42/09_architecture_decisions.html" class="btn btn-outline-primary">
                    Alle Architekturentscheidungen ansehen →
                </a>
            </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center py-5">
            <h3 class="mb-4">Bereit für strukturierte Architekturarbeit?</h3>
            <p class="lead mb-4">
                Dieses Projekt zeigt, wie Mensch-KI-Kollaboration professionelle Software-Architekturdokumentation beschleunigen kann.
            </p>
            <div class="d-flex justify-content-center gap-3 flex-wrap">
                <a href="arc42/arc42.html" class="btn btn-primary btn-lg">
                    📖 Vollständige Dokumentation lesen
                </a>
                <a href="https://github.com/raifdmueller/wardley-map-editor" class="btn btn-outline-primary btn-lg">
                    🔧 Quellcode ansehen
                </a>
                <a href="https://software-architektur.tv/2025/06/13/folge267.html" class="btn btn-outline-secondary btn-lg">
                    📺 Stream-Details ansehen
                </a>
            </div>
        </div>

        <!-- Footer Attribution -->
        <div class="border-top pt-4 mt-5">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <p class="text-muted mb-0">
                        <small>
                            Erstellt während <strong>"Software Architektur im Stream"</strong> - 
                            demonstriert echte Mensch-KI-Kollaboration in der Architekturarbeit.
                        </small>
                    </p>
                </div>
                <div class="col-md-4 text-md-end">
                    <small class="text-muted">
                        Entwickelt mit ❤️ von Ralf D. Müller & Claude (KI)
                    </small>
                </div>
            </div>
        </div>
    </main>
</div>
