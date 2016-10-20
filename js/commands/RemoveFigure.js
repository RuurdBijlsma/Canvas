class RemoveFigure extends Command {
    constructor(figure) {
        super();
        this.group = figure.parent;
        this.figure = figure;
        this.index = this.group.children.indexOf(figure);
    }
    execute() {
        this.group.children.splice(this.index, 1);
    }
    undo() {
        this.group.children.splice(this.index, 0, this.figure);
    }
}
