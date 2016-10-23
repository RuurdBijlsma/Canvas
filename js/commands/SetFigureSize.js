class SetFigureSize extends Command{
    constructor(figure, oldSize, newSize) {
        super();
        this.figure = figure;
        this.newPointA = newSize[0].clone();
        this.newPointB = newSize[1].clone();
        this.newPointA = oldSize[0].clone();
        this.newPointB = oldSize[1].clone();
    }
    execute() {
        this.figure.setSize(this.newPointA.clone(), this.newPointB.clone());
        this.figure.calculateGrabPoints();
    }
    undo(){
        this.figure.setSize(this.newPointA.clone(), this.newPointB.clone());
        this.figure.calculateGrabPoints();
    }
}
