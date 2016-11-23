class DrawVisitor extends GroupVisitor{
    constructor(context) {
    	super();
        this.context = context;
    }

    visit(figure) {
    	figure.draw(this.context);
    }
}
