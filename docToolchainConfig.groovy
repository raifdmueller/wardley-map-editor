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

// Site generation configuration for microsite
microsite.with {
    // Site metadata
    title = 'Wardley Map Editor - Architecture Documentation'
    
    // CRITICAL: Use our custom landing page
    landingPage = 'landingpage.gsp'
    
    // Footer configuration (NO HTML tags - causes serialization issues)
    footerText = 'Built with docToolchain and jBake - Human-AI Collaboration in Software Architecture'
    
    // Context path for deployment
    contextPath = '/wardley-map-editor'
    
    // Social Links for Footer
    footerGithub = 'https://github.com/raifdmueller/wardley-map-editor'
    footerMail = 'mailto:ralf.d.mueller@gmail.com'
    
    // Project specific branding
    issueUrl = 'https://github.com/raifdmueller/wardley-map-editor/issues/new'
    gitRepoUrl = 'https://github.com/raifdmueller/wardley-map-editor'
    branch = 'main'
    
    // Navigation menu configuration
    menu = [:]
}

// Additional attributes for AsciiDoc
jbake.asciidoctorAttributes = [
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

// PDF generation settings (optional)
asciidoctor = [
    'pdf-stylesdir': "${inputPath}/styles",
    'pdf-style': 'basic'
]

// These are directories (dirs) and files which Gradle monitors for a change
// in order to decide if the docs have to be re-build
taskInputsDirs = [
    "${inputPath}",
]

taskInputsFiles = []
