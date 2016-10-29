class SetFigureZIndex extends Command {
    constructor(figure, newZIndex) {
        super();
        this.figure = figure;
        this.oldZIndex = figure.zIndex;
        this.newZIndex = newZIndex;
    }
    execute() {
        this.figure.zIndex = this.newZIndex;
    }
    undo() {
        this.figure.zIndex = this.oldZIndex;
    }
}
