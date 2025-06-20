export class DSLParser {
    constructor() {
        this.componentRegex = /component\s+(\w+)\s*\[([0-9.]+),\s*([0-9.]+)\]/i;
        this.connectionRegex = /(\w+)\s*->\s*(\w+)/i;
        this.errors = [];
    }

    parse(dslText) {
        this.errors = [];
        const lines = dslText.split('\n').map(line => line.trim()).filter(line => line);
        
        const components = [];
        const connections = [];
        const componentNames = new Map();
        
        // First pass: Parse components
        lines.forEach((line, index) => {
            if (this.isComponentDefinition(line)) {
                try {
                    const component = this.parseComponent(line);
                    if (component) {
                        components.push(component);
                        componentNames.set(component.name, component.id);
                    }
                } catch (error) {
                    this.addError(index + 1, `Invalid component definition: ${error.message}`);
                }
            }
        });
        
        // Second pass: Parse connections
        lines.forEach((line, index) => {
            if (this.isConnectionDefinition(line)) {
                try {
                    const connection = this.parseConnection(line, componentNames);
                    if (connection) {
                        connections.push(connection);
                    }
                } catch (error) {
                    this.addError(index + 1, `Invalid connection definition: ${error.message}`);
                }
            }
        });
        
        return {
            components: components.map(comp => ({
                id: comp.id,
                label: comp.name,
                x: comp.x,
                y: comp.y
            })),
            connections,
            errors: this.errors
        };
    }

    isComponentDefinition(line) {
        return this.componentRegex.test(line);
    }

    isConnectionDefinition(line) {
        return this.connectionRegex.test(line);
    }

    parseComponent(line) {
        const match = line.match(this.componentRegex);
        if (!match) {
            throw new Error('Invalid component syntax');
        }

        const [, name, xStr, yStr] = match;
        const x = parseFloat(xStr);
        const y = parseFloat(yStr);

        if (isNaN(x) || isNaN(y)) {
            throw new Error('Invalid coordinates');
        }

        if (x < 0 || x > 1 || y < 0 || y > 1) {
            throw new Error('Coordinates must be between 0 and 1');
        }

        return {
            id: this.generateId(),
            name: name,
            x: x,
            y: y
        };
    }

    parseConnection(line, componentNames) {
        const match = line.match(this.connectionRegex);
        if (!match) {
            throw new Error('Invalid connection syntax');
        }

        const [, fromName, toName] = match;
        const fromId = componentNames.get(fromName);
        const toId = componentNames.get(toName);

        if (!fromId) {
            throw new Error(`Component "${fromName}" not found`);
        }

        if (!toId) {
            throw new Error(`Component "${toName}" not found`);
        }

        return {
            id: this.generateId(),
            from: fromId,
            to: toId,
            type: 'dependency'
        };
    }

    generateMapState(parsedData) {
        return {
            title: 'DSL Generated Map',
            components: parsedData.components,
            connections: parsedData.connections,
            selectedComponent: null,
            version: '1.0'
        };
    }

    generateDSL(mapState) {
        const lines = [];
        
        // Add title as comment
        if (mapState.title && mapState.title !== 'Untitled Map') {
            lines.push(`# ${mapState.title}`);
            lines.push('');
        }
        
        // Add components
        mapState.components.forEach(component => {
            const x = component.x.toFixed(2);
            const y = component.y.toFixed(2);
            lines.push(`component ${component.label.replace(/\s+/g, '_')} [${x}, ${y}]`);
        });
        
        if (mapState.components.length > 0 && mapState.connections.length > 0) {
            lines.push('');
        }
        
        // Add connections
        mapState.connections.forEach(connection => {
            const fromComponent = mapState.components.find(c => c.id === connection.from);
            const toComponent = mapState.components.find(c => c.id === connection.to);
            
            if (fromComponent && toComponent) {
                const fromName = fromComponent.label.replace(/\s+/g, '_');
                const toName = toComponent.label.replace(/\s+/g, '_');
                lines.push(`${fromName}->${toName}`);
            }
        });
        
        return lines.join('\n');
    }

    validate(dslText) {
        const parsed = this.parse(dslText);
        return {
            isValid: parsed.errors.length === 0,
            errors: parsed.errors,
            componentCount: parsed.components.length,
            connectionCount: parsed.connections.length
        };
    }

    addError(lineNumber, message) {
        this.errors.push({
            line: lineNumber,
            message: message
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getExampleDSL() {
        return `# Sample Wardley Map
component Users [0.9, 0.8]
component Website [0.7, 0.6]
component API [0.5, 0.4]
component Database [0.3, 0.2]
component CloudProvider [0.2, 0.1]

Users->Website
Website->API
API->Database
Database->CloudProvider`;
    }
}