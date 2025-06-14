<div class="row flex-xl-nowrap">
    <main class="col-12 col-md-12 col-xl-12 pl-md-12" role="main">
        <!-- Hero Section -->
        <div class="bg-primary text-white p-5 rounded mb-4">
            <div class="row align-items-center">
                <div class="col-lg-8">
                    <h1 class="display-4 fw-bold">🗺️ Wardley Map Editor</h1>
                    <p class="lead mb-4">
                        Professional strategic mapping tool with AI-powered architecture documentation
                    </p>
                    <p class="fs-5 mb-4">
                        Create, visualize, and export Wardley Maps with seamless draw.io integration. 
                        Built through <strong>Human-AI collaboration</strong> and documented with arc42 best practices.
                    </p>
                    <div class="d-flex gap-3">
                        <a href="arc42/arc42.html" class="btn btn-light btn-lg">📋 View Architecture</a>
                        <a href="https://github.com/raifdmueller/wardley-map-editor" class="btn btn-outline-light btn-lg">
                            <i class="fab fa-github"></i> GitHub Repository
                        </a>
                    </div>
                </div>
                <div class="col-lg-4 text-center">
                    <div class="bg-white bg-opacity-10 p-4 rounded">
                        <h5 class="text-white-50">Live Demo Results</h5>
                        <div class="display-6 fw-bold">50min</div>
                        <small class="text-white-50">Complete architecture in live stream</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Key Features Cards -->
        <div class="row row-cols-1 row-cols-md-3 mb-5 text-center">
            <div class="col">
                <div class="card mb-4 shadow-sm h-100">
                    <div class="card-header bg-success text-white">
                        <h4 class="my-0 fw-normal">🎯 Demo-Focused Architecture</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <p class="flex-grow-1">
                            Built for live demonstration with realistic quality goals: 
                            <strong>Demo-ready in 1 hour</strong>, verständlich für Zuschauer, 
                            maximaler Lernwert für AI-Collaboration.
                        </p>
                        <small class="text-muted">Quality Goal #1</small>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card mb-4 shadow-sm h-100">
                    <div class="card-header bg-info text-white">
                        <h4 class="my-0 fw-normal">🤖 AI-Human Collaboration</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <p class="flex-grow-1">
                            Demonstrates real-time collaboration between human expertise and AI assistance. 
                            <strong>4 Architecture Decision Records</strong> created with structured Pugh Matrix evaluation.
                        </p>
                        <small class="text-muted">Educational Value</small>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card mb-4 shadow-sm h-100">
                    <div class="card-header bg-warning text-dark">
                        <h4 class="my-0 fw-normal">📐 Professional Documentation</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <p class="flex-grow-1">
                            Complete <strong>arc42 documentation</strong> with all 12 chapters, 
                            PlantUML diagrams, and docToolchain integration. 
                            Ready for production environments.
                        </p>
                        <small class="text-muted">Documentation Quality</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Technology Showcase -->
        <div class="row mb-5">
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">🛠️ Technology Stack</h4>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            <li class="mb-2"><strong>Frontend:</strong> Vanilla JavaScript ES6+, HTML5, CSS3</li>
                            <li class="mb-2"><strong>Rendering:</strong> SVG for map visualization</li>
                            <li class="mb-2"><strong>Storage:</strong> Browser LocalStorage</li>
                            <li class="mb-2"><strong>Export:</strong> draw.io XML format</li>
                            <li class="mb-2"><strong>Documentation:</strong> arc42 + docToolchain + AsciiDoc</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">🎓 Learning Outcomes</h4>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            <li class="mb-2">✅ Structured architecture documentation practices</li>
                            <li class="mb-2">✅ AI-assisted software design workflows</li>
                            <li class="mb-2">✅ Architecture Decision Records (ADRs) with Pugh Matrix</li>
                            <li class="mb-2">✅ arc42 template implementation</li>
                            <li class="mb-2">✅ docs-as-code methodology</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Architecture Decisions Preview -->
        <div class="bg-light p-4 rounded mb-5">
            <h3 class="mb-4">📋 Key Architecture Decisions</h3>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="card border-success">
                        <div class="card-body">
                            <h6 class="card-title text-success">ADR-001: SVG vs Canvas</h6>
                            <p class="card-text small">SVG chosen for simpler event handling and better debugging capabilities in demo context.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card border-info">
                        <div class="card-body">
                            <h6 class="card-title text-info">ADR-002: Simple Event Handlers</h6>
                            <p class="card-text small">No frameworks needed - direct JavaScript for 1-hour implementation timeline.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center">
                <a href="arc42/09_architecture_decisions.html" class="btn btn-outline-primary">
                    View All Architecture Decisions →
                </a>
            </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center py-5">
            <h3 class="mb-4">Ready to explore structured architecture work?</h3>
            <p class="lead mb-4">
                This project showcases how Human-AI collaboration can accelerate professional software architecture documentation.
            </p>
            <div class="d-flex justify-content-center gap-3 flex-wrap">
                <a href="arc42/arc42.html" class="btn btn-primary btn-lg">
                    📖 Read Complete Documentation
                </a>
                <a href="https://github.com/raifdmueller/wardley-map-editor" class="btn btn-outline-primary btn-lg">
                    🔧 View Source Code
                </a>
                <a href="https://software-architektur.tv" class="btn btn-outline-secondary btn-lg">
                    📺 Watch the Stream
                </a>
            </div>
        </div>

        <!-- Footer Attribution -->
        <div class="border-top pt-4 mt-5">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <p class="text-muted mb-0">
                        <small>
                            Created during <strong>"Software Architektur im Stream"</strong> - 
                            demonstrating real Human-AI collaboration in architecture work.
                        </small>
                    </p>
                </div>
                <div class="col-md-4 text-md-end">
                    <small class="text-muted">
                        Built with ❤️ by Ralf D. Müller & Claude (AI)
                    </small>
                </div>
            </div>
        </div>
    </main>
</div>
