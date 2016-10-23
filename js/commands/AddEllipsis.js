class AddEllipsis extends Command {
    constructor(parent, x, y, w, h, color = '#ff0000', zIndex = 0) {
    	super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.parent = parent;
        this.color = color;
        this.zIndex = zIndex;
    }
    execute() {
        this.ellipsis = new Ellipsis(new Vector2(this.x, this.y), this.w, this.h, this.color, this.zIndex);
        this.parent.children.push(this.ellipsis);
    }
    undo(){
    	this.parent.children.remove(this.ellipsis);
    }
}
