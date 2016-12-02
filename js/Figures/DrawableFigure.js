class DrawableFigure extends Figure {
    constructor(parent, drawer, x, y, width = 0, height = 0, color = '#ff00ff', zIndex = 0) {
        super(parent, x, y, width, height, zIndex);
        this.drawer = drawer.instance;
        this.color = color;
    }

    draw(context) {
        super.draw(context);
        context.fillStyle = this.color;
        this.drawer.draw(context, this);
    }

    isInFigure(x, y) {
        return this.drawer.isInFigure(x, y, this);
    }

    toHTML() {
        return `<item id='${this.id}' onclick='CANVAS.selectById(${this.id})' onmousedown='CANVAS.startDragging(event)'>${this.drawer.name}</item>`;
    }

    get name() {
        return this.drawer.name;
    }

    get string() {
        let result = '';
        // for (let caption of this.captions)
        //     result += caption.toString(this.indentation);
        result += '\t'.repeat(this.indentation);
        return result + `${this.drawer.name} ${this.x} ${this.y} ${this.width} ${this.height}\n`;
    }
}
