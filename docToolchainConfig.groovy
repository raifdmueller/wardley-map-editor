outputPath = 'build'

// Path where the docToolchain will search for the input files.
// This path is appended to the docDir property specified in gradle.properties
// or in the command line, and therefore must be relative to it.

inputPath = 'docs';

// if you need to register custom Asciidoctor extensions, this is the right place
// configure the name and path to your extension, relative to the root of your project
// (relative to dtcw). For example: 'src/ruby/asciidoctor-lists.rb'.
// this is the same as the `requires`-list of the asciidoctor gradle plugin. The extensions will be
// registered for generateDeck, generateHTML, generatePDF and generateDocbook tasks, only.
// rubyExtensions = []

// the pdfThemeDir config in this file is outdated.
// please check http://doctoolchain.org/doctoolchain/v2.0.x/020_tutorial/030_generateHTML.html#_pdf_style for further details
// pdfThemeDir = './src/docs/pdfTheme'

inputFiles = [
        /** inputFiles **/
]

//folders in which asciidoc will find images.
//these will be copied as resources to ./images
//folders are relative to inputPath
// Hint: If you define an imagespath in your documents like
// :imagesdir: ./whatsoever
// define it conditional like
// ifndef::imagesdir[:imagesdir: ./whatsoever]
// as doctoolchain defines :imagesdir: during generation
imageDirs = [
        /** imageDirs **/
]

// whether the build should fail when detecting broken image references
// if this config is set to true all images will be embedded
failOnMissingImages = true

// these are directories (dirs) and files which Gradle monitors for a change
// in order to decide if the docs have to be re-build
taskInputsDirs = [
                    "${inputPath}",
//                    "${inputPath}/src",
//                    "${inputPath}/images",
                ]

taskInputsFiles = []
