class AddRectangle extends Command {
    constructor(x, y, w, h, color = '#ff0000', zIndex = 0) {
    	super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.zIndex = zIndex;
    }
    execute() {
        this.rectangle = new Rectangle(new Vector2(this.x, this.y), this.w, this.h, this.color, this.xIndex);
        CANVAS.figures.push(this.rectangle);
    }
    undo(){
    	CANVAS.figures.remove(this.rectangle);
    }
}
