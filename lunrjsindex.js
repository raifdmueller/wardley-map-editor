var documents = [

{
    "id": 0,
    "uri": "arc42/01_introduction_and_goals.html",
    "menu": "arc42",
    "title": "1. Einführung und Ziele",
    "text": " Table of Contents 1. Einführung und Ziele 1.1 Aufgabenstellung 1.2 Qualitätsziele 1.3 Stakeholder 1. Einführung und Ziele Beschreibt die wesentlichen Anforderungen und treibenden Kräfte, die bei der Umsetzung der Softwarearchitektur und Entwicklung des Systems berücksichtigt werden müssen. 1.1 Aufgabenstellung Was ist der Wardley Map Editor? Ein web-basierter Editor zur visuellen Erstellung von Wardley Maps mit Export-Funktionalität zu draw.io. KRITISCHE FRAGE: Warum brauchen wir das? Existierende Tools: * Online Wardley Maps - bereits verfügbar * Verschiedene draw.io Templates * Text-basierte Tools Was macht unseren Editor einzigartig? Wesentliche Features (MVP) Visuelle Map-Erstellung Drag &amp; Drop für Komponenten Positionierung auf Evolution/Value-Achsen Abhängigkeiten zwischen Komponenten draw.io Export XML-Generierung für draw.io Import Erhaltung der Map-Struktur Browser-basiert Keine Installation erforderlich LocalStorage für Persistierung 1.2 Qualitätsziele Die drei (!) wichtigsten Qualitätsziele für die Architektur. Maximal fünf Ziele sollten hier genannt werden. Priorität Qualitätsziel Szenario/Messbarkeit 1 Usability Ein Wardley Map-Neuling kann in &lt;10 Minuten eine Map mit 5 Komponenten erstellen 2 Performance Rendering von Maps mit 100 Komponenten in &lt;200ms auf Standard-Hardware 3 Kompatibilität Exportierte draw.io-Dateien sind 100% kompatibel und bearbeitbar KRITISCHE ANMERKUNG: Diese Ziele sind noch zu vage! Wir brauchen konkretere Metriken: * Was ist \"Standard-Hardware\"? * Wie messen wir \"100% kompatibel\"? * Welche Browser-Versionen unterstützen wir? 1.3 Stakeholder Überblick über die Stakeholder des Systems, d.h. alle Personen, Rollen oder Organisationen, die * das System kennen sollten oder * von der Architektur überzeugt werden müssen oder * mit dem System oder seiner Entwicklung zu tun haben. Rolle Kontakt Erwartungen Stream-Zuschauer Software Architektur im Stream Community Lernen, wie AI-assistierte Architektur funktioniert Wardley Map Praktiker Simon Wardley Community Einfaches Tool für Map-Erstellung Enterprise Architects Unternehmen mit draw.io-Infrastruktur Integration in bestehende Tool-Landschaft Entwickler-Team Ralf + Claude (AI) Demonstrieren von Human-AI Collaboration REALITÄTS-CHECK: Haben wir tatsächlich mit echten Wardley Map-Nutzern gesprochen? Oder entwickeln wir \"ins Blaue hinein\"? "
},

{
    "id": 1,
    "uri": "arc42/arc42.html",
    "menu": "arc42",
    "title": "Architecture Documentation: Wardley Map Editor",
    "text": " Table of Contents Architecture Documentation: Wardley Map Editor 1. Einführung und Ziele 1.1 Aufgabenstellung Was ist der Wardley Map Editor? Wesentliche Features (MVP) 1.2 Qualitätsziele 1.3 Stakeholder Architecture Documentation: Wardley Map Editor Ralf D. Müller &lt; ralf.d.mueller@gmail.com &gt; :doctype: book :toc: left :toclevels: 3 :sectnum: :sectanchors: :sectnums: :source-highlighter: highlight.js :icons: font :imagesdir: images 1. Einführung und Ziele Beschreibt die wesentlichen Anforderungen und treibenden Kräfte, die bei der Umsetzung der Softwarearchitektur und Entwicklung des Systems berücksichtigt werden müssen. 1.1 Aufgabenstellung Was ist der Wardley Map Editor? Ein web-basierter Editor zur visuellen Erstellung von Wardley Maps mit Export-Funktionalität zu draw.io. KRITISCHE FRAGE: Warum brauchen wir das? Existierende Tools: * Online Wardley Maps - bereits verfügbar * Verschiedene draw.io Templates * Text-basierte Tools Was macht unseren Editor einzigartig? Wesentliche Features (MVP) Visuelle Map-Erstellung Drag &amp; Drop für Komponenten Positionierung auf Evolution/Value-Achsen Abhängigkeiten zwischen Komponenten draw.io Export XML-Generierung für draw.io Import Erhaltung der Map-Struktur Browser-basiert Keine Installation erforderlich LocalStorage für Persistierung 1.2 Qualitätsziele Die drei (!) wichtigsten Qualitätsziele für die Architektur. Maximal fünf Ziele sollten hier genannt werden. Priorität Qualitätsziel Szenario/Messbarkeit 1 Usability Ein Wardley Map-Neuling kann in &lt;10 Minuten eine Map mit 5 Komponenten erstellen 2 Performance Rendering von Maps mit 100 Komponenten in &lt;200ms auf Standard-Hardware 3 Kompatibilität Exportierte draw.io-Dateien sind 100% kompatibel und bearbeitbar KRITISCHE ANMERKUNG: Diese Ziele sind noch zu vage! Wir brauchen konkretere Metriken: * Was ist \"Standard-Hardware\"? * Wie messen wir \"100% kompatibel\"? * Welche Browser-Versionen unterstützen wir? 1.3 Stakeholder Überblick über die Stakeholder des Systems, d.h. alle Personen, Rollen oder Organisationen, die * das System kennen sollten oder * von der Architektur überzeugt werden müssen oder * mit dem System oder seiner Entwicklung zu tun haben. Rolle Kontakt Erwartungen Stream-Zuschauer Software Architektur im Stream Community Lernen, wie AI-assistierte Architektur funktioniert Wardley Map Praktiker Simon Wardley Community Einfaches Tool für Map-Erstellung Enterprise Architects Unternehmen mit draw.io-Infrastruktur Integration in bestehende Tool-Landschaft Entwickler-Team Ralf + Claude (AI) Demonstrieren von Human-AI Collaboration REALITÄTS-CHECK: Haben wir tatsächlich mit echten Wardley Map-Nutzern gesprochen? Oder entwickeln wir \"ins Blaue hinein\"? Unresolved directive in &lt;stdin&gt; - include::02_architecture_constraints.adoc[] Unresolved directive in &lt;stdin&gt; - include::03_system_scope_and_context.adoc[] Unresolved directive in &lt;stdin&gt; - include::04_solution_strategy.adoc[] Unresolved directive in &lt;stdin&gt; - include::05_building_block_view.adoc[] Unresolved directive in &lt;stdin&gt; - include::06_runtime_view.adoc[] Unresolved directive in &lt;stdin&gt; - include::07_deployment_view.adoc[] Unresolved directive in &lt;stdin&gt; - include::08_concepts.adoc[] Unresolved directive in &lt;stdin&gt; - include::09_architecture_decisions.adoc[] Unresolved directive in &lt;stdin&gt; - include::10_quality_requirements.adoc[] Unresolved directive in &lt;stdin&gt; - include::11_risks_and_technical_debt.adoc[] Unresolved directive in &lt;stdin&gt; - include::12_glossary.adoc[] "
},

{
    "id": 2,
    "uri": "search.html",
    "menu": "-",
    "title": "search",
    "text": " Search Results "
},

{
    "id": 3,
    "uri": "lunrjsindex.html",
    "menu": "-",
    "title": "null",
    "text": " will be replaced by the index "
},

];
