/**
 * MapEngine - Core logic for Wardley Map management
 * Manages components, dependencies and map metadata
 */
class MapEngine {
    constructor() {
        this.components = [];
        this.dependencies = [];
        this.title = 'Untitled Map';
        this.id = crypto.randomUUID();
        this.lastModified = new Date().toISOString();
    }
}