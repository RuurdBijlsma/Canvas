class FigureCollection extends Array {
    constructor(...figures) {
        super();

        for (let figure of figures) {
            super.push(figure);
            if(figure instanceof Figure)
                figure.zIndexUpdated = () => this.sort();
        }

        this.sort();
        this.selected = null;
    }
    sort() {
        super.sort((a, b) => a.zIndex > b.zIndex);
    }
    push(...figures) {
        for (let item of figures) {
            super.push(item);

            let that = this;
            if (figure instanceof Figure)
                figure.zIndexUpdated = () => this.sort();
        }
        this.sort();
    }
    splice(startIndex, amount) {
        super.splice(startIndex, amount);
    }
    getFigure(position) {
        for (let i = this.length - 1; i >= 0; i--) {
            if (this[i].isInFigure(position))
                return this[i];
        }
        return null;
    }
    remove(figure) {
        let index = this.indexOf(figure);
        index !== -1 && super.splice(index, 1);
    }
}
