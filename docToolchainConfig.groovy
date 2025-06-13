// docToolchain configuration for Wardley Map Editor
// Documentation: https://doctoolchain.org/docToolchain/v2.0.x/

// Output and input directories
outputPath = 'build/docs'
inputPath = 'docs'

// Files to be converted
inputFiles = [
    [file: 'arc42/arc42.adoc', formats: ['html']],
]

// Where to find images
imageDirs = [
    "${inputPath}/images",
    "${inputPath}/arc42/images"
]

// CRITICAL: Files to exclude from jbake navigation
jbake = [
    // Hide ADR files from menu
    exclude: [
        'adr-001-svg-rendering.adoc',
        'adr-002-architecture-pattern.adoc', 
        'adr-003-data-persistence.adoc',
        'adr-004-user-interaction.adoc'
    ],
    
    // Additional attributes for AsciiDoc
    asciidoctorAttributes: [
        'toc': 'left',
        'toclevels': '3',
        'sectlinks': '',
        'sectanchors': '',
        'numbered': '',
        'icons': 'font',
        'source-highlighter': 'highlight.js',
        'imagesdir': 'images',
        'plantuml-server-url': 'http://www.plantuml.com/plantuml',
        'allow-uri-read': ''
    ]
]

// PDF generation settings (optional)
asciidoctor = [
    'pdf-stylesdir': "${inputPath}/styles",
    'pdf-style': 'basic'
]

// Site generation configuration
microsite = [:]

microsite.with {
    // Site metadata
    title = 'Wardley Map Editor - Architecture Documentation'
    
    // Navigation menu configuration
    // The menu will automatically include files based on folder structure
    // Files with :jbake-menu: - will be excluded
    menu = [:]
    
    // Footer configuration
    footerText = '<small class="text-white">built with <a href="https://doctoolchain.org">docToolchain</a> and <a href="https://jbake.org">jBake</a> <br /> Architecture created via Human-AI collaboration</small>'
    
    // Landing page
    landingPage = 'landingpage.gsp'
    
    // Context path for deployment
    contextPath = '/wardley-map-editor'
}

// These are directories (dirs) and files which Gradle monitors for a change
// in order to decide if the docs have to be re-build
taskInputsDirs = [
    "${inputPath}",
]

taskInputsFiles = []
