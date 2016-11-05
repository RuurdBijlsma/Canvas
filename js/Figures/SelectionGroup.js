class SelectionGroup extends Group {
    constructor(figures) {
        super();
        this.children = this.children.concat(figures);
        Figure.figureAmount--;
        this.id = 'selection';
    }
}
