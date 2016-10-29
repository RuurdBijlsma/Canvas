class SelectionGroup extends Group {
    constructor(figures) {
        super();
        console.log(figures);
        this.children = this.children.concat(figures);
        Figure.figureAmount--;
        this.id = 'selection';
    }
}
