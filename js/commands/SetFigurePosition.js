class SetFigurePosition extends Command{
    constructor(figure, oldPos, newPos) {
        super();
        this.figure = figure;
        this.newPos = newPos.clone();
        this.oldPos = oldPos.clone();
    }
    execute() {
        this.figure.x = this.newPos.x;
        this.figure.y = this.newPos.y;
    }
    undo(){
        this.figure.x = this.oldPos.x;
        this.figure.y = this.oldPos.y;
    }
}
