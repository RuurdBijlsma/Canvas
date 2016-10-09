class SetFigureSize extends Command{
    constructor(figure, oldTL, newTL) {
        super();
        this.figure = figure;
        this.pointA = newTL[0].clone();
        this.pointB = newTL[1].clone();
        this.oldA = oldTL[0].clone();
        this.oldB = oldTL[1].clone();
    }
    execute() {
        this.figure.setSize(this.pointA.clone(), this.pointB.clone());
        this.figure.calculateGrabPoints();
    }
    undo(){
        this.figure.setSize(this.oldA.clone(), this.oldB.clone());
        this.figure.calculateGrabPoints();
    }
}
