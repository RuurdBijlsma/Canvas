class Rectangle extends Figure {
    draw(canvas) {
        super.draw(canvas);
        canvas.context.fillRect(this.x, this.y, this.width, this.height);
    }
}
