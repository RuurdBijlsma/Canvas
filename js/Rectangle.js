class Rectangle extends Figure {
    constructor(position, width, height, color='black', zIndex=0) {
        super(position, width, height, color, zIndex);
    }
    draw(canvas) {
        super.draw(canvas);
        canvas.context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
