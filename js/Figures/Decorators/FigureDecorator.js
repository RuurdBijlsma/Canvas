class FigureDecorator extends Figure {
    constructor(figure) {
        super(0, 0, 0, 0, 0, 0, true);
        this.figure = figure;

        this.x = figure.x;
        this.y = figure.y;
        this.width = figure.width;
        this.height = figure.height;
        this.parent = figure.parent;

        this.id = figure.id;

        this.zIndexUpdated = figure.zIndexUpdated;
        this.zIndex = figure.zIndex;
        this.grabPoints = figure.grabPoints;
    }
    draw(context) {
        this.figure.draw(context);
    }
    accept(visitor) {
        if (visitor instanceof DrawVisitor) {
            super.accept(visitor);
        }

        this.figure.accept(visitor);
    }
    get position() {
        return this.figure.position;
    }
    set width(width) {
        this.figure.width = width;
    }
    get width() {
        return this.figure.width;
    }
    set height(height) {
        this.figure.height = height;
    }
    get height() {
        return this.figure.height;
    }
    set x(x) {
        this.figure.x = x;
    }
    get x() {
        return this.figure.x;
    }
    set y(y) {
        this.figure.y = y;
    }
    get y() {
        return this.figure.y;
    }
    get cornerPoints() {
        return this.figure.cornerPoints;
    }
    get sides() {
        return this.figure.sides;
    }
    fixPoints(pointA, pointB) {
        return this.figure.fixPoints(pointA, pointB);
    }
    setSize(pointA, pointB) {
        return this.figure.setSize(pointA, pointB);
    }
    drawBoundingBox(canvas) {
        return this.figure.drawBoundingBox(canvas);
    }
    isInFigure(x, y) {
        return this.figure.isInFigure(x, y);
    }
    isInSelection(topLeft, bottomRight) {
        return this.figure.isInSelection(topLeft, bottomRight);
    }
    set zIndex(val) {
        this.figure.zIndex = val;
    }
    get zIndex() {
        return this.figure.zIndex;
    }
    toHTML() {
        return this.figure.toHTML();
    }
    toString() {
        return this.figure.toString();
    }
    get name() {
        return this.figure.name;
    }
    get indentation() {
        return this.figure.indentation;
    }
    get string() {
        return this.figure.string;
    }
}
