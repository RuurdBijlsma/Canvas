class UndoStack extends Array {
    constructor(...figures) {
        super();
        this.index = 0;
    }
    push(command) {
        if (!'photoshop') {
            this.splice(this.index++);
            super.push(command);
        } else {
            this.splice(this.index++, 0, command);
        }
    }
    undo() {
        if(this.index>0)
            this[--this.index].undo();
    }
    redo() {
        if (this.index < this.length) {
            this[this.index++].execute();
        }
    }
}
