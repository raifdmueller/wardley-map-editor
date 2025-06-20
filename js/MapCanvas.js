export class MapCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.mapState = null;
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.dragComponent = null;
        this.dragOffset = { x: 0, y: 0 };
        
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
        
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    updateMapState(mapState) {
        this.mapState = mapState;
        this.render();
    }

    render() {
        this.clearCanvas();
        this.drawAxes();
        this.drawGrid();
        
        if (this.mapState) {
            this.drawConnections();
            this.drawComponents();
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawAxes() {
        const { width, height } = this.canvas;
        const margin = 50;
        
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.font = '14px sans-serif';
        this.ctx.fillStyle = '#2c3e50';
        
        // X-axis (bottom)
        this.ctx.beginPath();
        this.ctx.moveTo(margin, height - margin);
        this.ctx.lineTo(width - margin, height - margin);
        this.ctx.stroke();
        
        // Y-axis (left)
        this.ctx.beginPath();
        this.ctx.moveTo(margin, margin);
        this.ctx.lineTo(margin, height - margin);
        this.ctx.stroke();
        
        // X-axis labels
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Genesis', margin + 50, height - 20);
        this.ctx.fillText('Custom', width - margin - 50, height - 20);
        
        // Y-axis labels
        this.ctx.save();
        this.ctx.translate(20, height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Invisible ← → Visible', 0, 0);
        this.ctx.restore();
    }

    drawGrid() {
        const { width, height } = this.canvas;
        const margin = 50;
        const gridSize = 50;
        
        this.ctx.strokeStyle = '#ecf0f1';
        this.ctx.lineWidth = 1;
        
        // Vertical grid lines
        for (let x = margin; x <= width - margin; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, margin);
            this.ctx.lineTo(x, height - margin);
            this.ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let y = margin; y <= height - margin; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(margin, y);
            this.ctx.lineTo(width - margin, y);
            this.ctx.stroke();
        }
    }

    drawComponents() {
        if (!this.mapState?.components) return;
        
        this.mapState.components.forEach(component => {
            this.drawComponent(component);
        });
    }

    drawComponent(component) {
        const { x, y } = this.mapToCanvas(component.x, component.y);
        const isSelected = this.mapState?.selectedComponent === component.id;
        
        // Draw component circle
        this.ctx.fillStyle = isSelected ? '#3498db' : '#e74c3c';
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw component label
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(component.label, x, y + 30);
    }

    drawConnections() {
        if (!this.mapState?.connections) return;
        
        this.ctx.strokeStyle = '#7f8c8d';
        this.ctx.lineWidth = 2;
        
        this.mapState.connections.forEach(connection => {
            this.drawConnection(connection);
        });
    }

    drawConnection(connection) {
        const fromComponent = this.mapState.components.find(c => c.id === connection.from);
        const toComponent = this.mapState.components.find(c => c.id === connection.to);
        
        if (!fromComponent || !toComponent) return;
        
        const from = this.mapToCanvas(fromComponent.x, fromComponent.y);
        const to = this.mapToCanvas(toComponent.x, toComponent.y);
        
        // Draw arrow line
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
        
        // Draw arrowhead
        this.drawArrowhead(from.x, from.y, to.x, to.y);
    }

    drawArrowhead(fromX, fromY, toX, toY) {
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const arrowLength = 15;
        const arrowAngle = Math.PI / 6;
        
        this.ctx.beginPath();
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(
            toX - arrowLength * Math.cos(angle - arrowAngle),
            toY - arrowLength * Math.sin(angle - arrowAngle)
        );
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(
            toX - arrowLength * Math.cos(angle + arrowAngle),
            toY - arrowLength * Math.sin(angle + arrowAngle)
        );
        this.ctx.stroke();
    }

    mapToCanvas(mapX, mapY) {
        const { width, height } = this.canvas;
        const margin = 50;
        
        return {
            x: margin + mapX * (width - 2 * margin),
            y: height - margin - mapY * (height - 2 * margin)
        };
    }

    canvasToMap(canvasX, canvasY) {
        const { width, height } = this.canvas;
        const margin = 50;
        
        return {
            x: Math.max(0, Math.min(1, (canvasX - margin) / (width - 2 * margin))),
            y: Math.max(0, Math.min(1, (height - margin - canvasY) / (height - 2 * margin)))
        };
    }

    getComponentAt(canvasX, canvasY) {
        if (!this.mapState?.components) return null;
        
        for (const component of this.mapState.components) {
            const { x, y } = this.mapToCanvas(component.x, component.y);
            const distance = Math.sqrt((canvasX - x) ** 2 + (canvasY - y) ** 2);
            
            if (distance <= 15) {
                return component;
            }
        }
        
        return null;
    }

    handleMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;
        
        const component = this.getComponentAt(canvasX, canvasY);
        
        if (component) {
            this.isDragging = true;
            this.dragComponent = component;
            const canvasPos = this.mapToCanvas(component.x, component.y);
            this.dragOffset = {
                x: canvasX - canvasPos.x,
                y: canvasY - canvasPos.y
            };
            
            this.onComponentSelect?.(component.id);
        } else {
            const mapPos = this.canvasToMap(canvasX, canvasY);
            this.onCanvasClick?.(mapPos.x, mapPos.y);
        }
    }

    handleMouseMove(event) {
        if (!this.isDragging || !this.dragComponent) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left - this.dragOffset.x;
        const canvasY = event.clientY - rect.top - this.dragOffset.y;
        
        const mapPos = this.canvasToMap(canvasX, canvasY);
        this.onComponentMove?.(this.dragComponent.id, mapPos.x, mapPos.y);
    }

    handleMouseUp() {
        this.isDragging = false;
        this.dragComponent = null;
        this.dragOffset = { x: 0, y: 0 };
    }

    handleWheel(event) {
        event.preventDefault();
        
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        this.zoom(zoomFactor);
    }

    handleResize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth - 20;
        this.canvas.height = container.clientHeight - 20;
        this.render();
    }

    zoom(factor) {
        this.scale *= factor;
        this.scale = Math.max(0.1, Math.min(3, this.scale));
        this.render();
    }

    resetView() {
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.render();
    }
}