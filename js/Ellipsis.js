class Ellipsis extends Figure {
    constructor(parent, position, width, height, color = 'black', zIndex = 0) {
        super(parent, position, width, height, color, zIndex);
    }
    draw(canvas) {
        super.draw(canvas);
        canvas.context.beginPath();
        canvas.context.ellipse(this.position.x + this.width / 2, this.position.y + this.height / 2, this.width / 2, this.height / 2, 0, Math.PI * 2, 0);
        canvas.context.fill();
    }
    isInFigure(position) { //override to fit ellipsis
        let cosa = Math.cos(0),
            sina = Math.sin(0),
            dd = this.width / 2 * this.width / 2,
            DD = this.height / 2 * this.height / 2,
            a = Math.pow(cosa * (position.x - this.position.x - this.width / 2) + sina * (position.y - this.position.y - this.height / 2), 2),
            b = Math.pow(sina * (position.x - this.position.x - this.width / 2) + cosa * (position.y - this.position.y - this.height / 2), 2),
            ellipse = (a / dd) + (b / DD);

        return ellipse <= 1 ? this : false;
    }
}
