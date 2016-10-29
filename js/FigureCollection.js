class FigureCollection extends Array {
    constructor(...figures) {
        super();

        for (let figure of figures) {
            super.push(figure);
            if (figure instanceof Figure)
                figure.zIndexUpdated = () => this.sort();
        }

        this.onChange = function() {};

        this.sort();
    }
    sort() {
        super.sort((a, b) => a.id > b.id);
        super.sort((a, b) => a.zIndex > b.zIndex);
        this.onChange();
    }
    push(...figures) {
        for (let figure of figures) {
            super.push(figure);

            let that = this;
            if (figure instanceof Figure)
                figure.zIndexUpdated = () => this.sort();
        }
        this.sort();
    }
    splice(startIndex, amount, newItem) {
        if (newItem)
            super.splice(startIndex, amount, newItem);
        else
            super.splice(startIndex, amount);
        this.onChange();
    }
    remove(figure) {
        let index = this.indexOf(figure);
        index !== -1 && super.splice(index, 1);
        this.onChange();
    }
}
