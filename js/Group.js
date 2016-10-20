class Group extends Figure {
    constructor(parent, zIndex = 0, ...children) {
        super(parent, new Vector2);
        this.children = new FigureCollection();
        this.zIndex = zIndex;
        for (let child of children)
            this.children.push(child);
    }
    isInFigure(position) {
        return this.getFigure(position);
    }
    draw(canvas) {
        for (let figure of this.children) {
            if (figure.draw) {
                figure.draw(canvas);
            }
        }
    }
    getFigure(position) {
        for (let figure of this.children) {
            let selected = figure.isInFigure(position);
            if (selected)
                return selected;
        }
        return false;
    }
}
