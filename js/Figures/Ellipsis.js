class Ellipsis extends Figure {
    draw(canvas) {
        super.draw(canvas);
        canvas.context.beginPath();
        canvas.context.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2, 0, Math.PI * 2, 0);
        canvas.context.fill();
    }
    isInFigure(x, y) {
        let cosa = Math.cos(0),
            sina = Math.sin(0),
            halfWidthSquared = this.width / 2 * this.width / 2,
            halfHeightSquared = this.height / 2 * this.height / 2,
            a = Math.pow(cosa * (x - this.x - this.width / 2) + sina * (y - this.y - this.height / 2), 2),
            b = Math.pow(sina * (x - this.x - this.width / 2) + cosa * (y - this.y - this.height / 2), 2),
            ellipse = (a / halfWidthSquared) + (b / halfHeightSquared);

        return ellipse <= 1 ? this : false;
    }
}
