class AddFigure extends Command {
    constructor(instance, parent, x, y, w, h, color = '#ff0000', zIndex = 0) {
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.parent = parent;
        this.color = color;
        this.zIndex = zIndex;
        this.instance = instance;
    }

    execute() {
        this.figure = new this.instance(this.parent, this.x, this.y, this.w, this.h, this.color, this.zIndex);
        this.parent.children.push(this.figure);
    }
    
    undo() {
        this.parent.children.remove(this.figure);
    }
}
