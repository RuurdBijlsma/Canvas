class AddDrawableFigure extends AddFigure {
    constructor(drawer, parent, x, y, w, h, color = '#ff0000', zIndex = 0) {
        super(DrawableFigure, parent, x, y, w, h, color, zIndex);
        this.drawer = drawer;
    }

    execute() {
        this.figure = new this.instance(this.parent, this.drawer, this.x, this.y, this.w, this.h, this.color, this.zIndex);
        this.parent.children.push(this.figure);
    }
}
