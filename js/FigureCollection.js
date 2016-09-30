class FigureCollection extends Array {
    constructor(...figures) {
        super();
        for (let item of figures) {
            super.push(item);

            let that = this;
            item.zIndexUpdated = function() {
                that.sort();
            }
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
            item.zIndexUpdated = function() {
                that.sort();
            }
        }
        this.sort();
    }
    splice(startIndex, amount, ...toInsert) {
        super.splice(startIndex, amount);
        this.push(toInsert);

        this.sort();
    }
    getFigure(position) {
        for (let i = this.length - 1; i >= 0; i--) {
            if (this[i].isInFigure(position))
                return this[i];
        }
        return null;
    }
}
