class SetFigureParent extends Command {
    constructor(figure, newParent) {
        super();
        this.figure = figure;
        this.oldParent = figure.parent;
        this.newParent = newParent;
    }
    execute() {
        this.oldParent.remove(this.figure);
        this.newParent.children.push(this.figure);
        this.figure.parent = this.newParent;
    }
    undo() {
        this.newParent.remove(this.figure);
        this.oldParent.children.push(this.figure);
        this.figure.parent = this.oldParent;
    }
}
