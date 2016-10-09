class SetFigurePosition extends Command{
    constructor(figure, oldPos, newPos) {
        super();
        this.figure = figure;
        this.newPos = newPos.clone();
        this.oldPos = oldPos.clone();
    }
    execute() {
    	this.figure.position = this.newPos.clone();
        this.figure.calculateGrabPoints();
    }
    undo(){
    	this.figure.position = this.oldPos.clone();
        this.figure.calculateGrabPoints();
    }
}