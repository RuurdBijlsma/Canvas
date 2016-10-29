class Command {
    constructor() {
        CANVAS.undoStack.push(this);
    }
}
