class BaseFigure extends Figure {
    constructor(x, y, width, height, color = 'black') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    get position() {
        return new Vector2(this.x, this.y);
    }

    set width(width) {
        this._width = width >= 0 ? width : this.width;
        this.calculateGrabPoints();
    }
    get width() {
        return this._width;
    }

    set height(height) {
        this._height = height >= 0 ? height : this.height;
        this.calculateGrabPoints();
    }
    get height() {
        return this._height;
    }

    set x(x) {
        this._x = x;
        this.calculateGrabPoints();
    }
    get x() {
        return this._x;
    }

    set y(y) {
        this._y = y;
        this.calculateGrabPoints();
    }
    get y() {
        return this._y;
    }
}
