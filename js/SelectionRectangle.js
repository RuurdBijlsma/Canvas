class SelectionRectangle extends Rectangle {
    constructor(parent, x, y) {
        super(parent, x, y, 0, 0, 'rgba(0, 120, 200, 0.4)', Infinity);
        Figure.figureAmount--;
        delete this.id;
    }
}
