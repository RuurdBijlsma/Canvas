class Figure {
    constructor(position, width, height, color, zIndex) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;

        this.grabPoints = this.calculateGrabPoints();

        this.zIndexUpdated = function() {};
        this.zIndex = zIndex;
    }
    calculateGrabPoints() {
        return {
            left: new Vector2(
                this.position.x,
                this.position.y + this.height / 2
            ),
            right: new Vector2(
                this.position.x + this.width,
                this.position.y + this.height / 2
            ),
            top: new Vector2(
                this.position.x + this.width / 2,
                this.position.y
            ),
            bottom: new Vector2(
                this.position.x + this.width / 2,
                this.position.y + this.height
            ),
            topLeft: new Vector2(
                this.position.x,
                this.position.y
            ),
            topRight: new Vector2(
                this.position.x + this.width,
                this.position.y
            ),
            bottomLeft: new Vector2(
                this.position.x,
                this.position.y + this.height
            ),
            bottomRight: new Vector2(
                this.position.x + this.width,
                this.position.y + this.height
            )
        }
    }
    draw(canvas) {
        canvas.context.fillStyle = this.color;
    }
    isInFigure(position) {
        return position.x >= this.position.x && position.x <= this.position.x + this.width && position.y >= this.position.y && position.y <= this.position.y + this.height;
    }
    set zIndex(val) {
        this._zIndex = val;
        this.zIndexUpdated();
    }
    get zIndex() {
        return this._zIndex;
    }
}
