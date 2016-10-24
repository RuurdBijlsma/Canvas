class Rectangle extends Figure {
    constructor(parent, x, y, width, height, color = 'black', zIndex = 0) {
        super(parent, x, y, width, height, color, zIndex);
    }
    draw(canvas) {
        super.draw(canvas);
        canvas.context.fillRect(this.x, this.y, this.width, this.height);
    }
}
