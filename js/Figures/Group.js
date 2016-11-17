class Group extends Figure {
    constructor(parent, zIndex = 0, ...children) {
        super(parent, new Vector2);
        this.children = new FigureCollection();

        this.children.onChange = () => this.updateHTML();
        this.zIndex = zIndex;
        for (let child of children)
            this.children.push(child);
    }

    accept(visitor) {
        if (visitor instanceof GroupVisitor)
            visitor.visit(this);
        if (this.children)
            for (let child of this.children)
                child.accept(visitor);
    }

    get cornerPoints() {
        let leftMax = Infinity,
            topMax = Infinity,
            rightMax = -Infinity,
            bottomMax = -Infinity;
        if (this.children)
            for (let child of this.children) {
                let points = child.cornerPoints,
                    left = points.topLeft.x,
                    top = points.topLeft.y,
                    right = points.bottomRight.x,
                    bottom = points.bottomRight.y;

                leftMax = left < leftMax ? left : leftMax;
                topMax = top < topMax ? top : topMax;
                bottomMax = bottom > bottomMax ? bottom : bottomMax;
                rightMax = right > rightMax ? right : rightMax;
            }
        return {
            topLeft: new Vector2(leftMax, topMax),
            bottomRight: new Vector2(rightMax, bottomMax),
            topRight: new Vector2(rightMax, topMax),
            bottomLeft: new Vector2(leftMax, bottomMax)
        }
    }

    get x() {
        let xGetter = new GetVisitor('x', Infinity, (lowest, check) => check < lowest ? check : lowest);
        this.accept(xGetter);
        return xGetter.result;
    }
    get y() {
        let yGetter = new GetVisitor('y', Infinity, (lowest, check) => check < lowest ? check : lowest);
        this.accept(yGetter);
        return yGetter.result;
    }

    set x(newX) {
        let xSetter = new SetVisitor('x', newX - this.x);
        this.accept(xSetter);
    }
    set y(newY) {
        let ySetter = new SetVisitor('y', newY - this.y);
        this.accept(ySetter);
    }

    get height() {
        let points = this.cornerPoints,
            height = Math.abs(points.topLeft.y - points.bottomRight.y);
        return height;
    }

    get width() {
        let points = this.cornerPoints,
            width = Math.abs(points.topLeft.x - points.bottomRight.x);
        return width;
    }

    set height(newHeight) {
        let factor = newHeight / this.height;
        if (factor !== 0) {
            let heightSetter = new SetVisitor('height', factor, (a, b) => a * b),
                ySetter = new SetVisitor('y', factor, (a, b) => a + (a - this.y) * (factor - 1));
            this.accept(heightSetter);
            this.accept(ySetter);
        }
    }

    set width(newWidth) {
        let factor = newWidth / this.width;
        if (factor !== 0) {
            let widthSetter = new SetVisitor('width', factor, (a, b) => a * b),
                xSetter = new SetVisitor('x', factor, (a, b) => a + (a - this.x) * (factor - 1));
            this.accept(widthSetter);
            this.accept(xSetter);
        }
    }

    isInFigure(x, y) {
        return this.getFigure(x, y);
    }

    draw(context) {
        super.draw(context);
        for(let child of this.children)
            child.draw(context);
    }

    getFigure(x, y) {
        for (let i = this.children.length - 1; i >= 0; i--) {
            let selected = this.children[i].isInFigure(x, y);
            if (selected)
                return selected;
        }
        return false;
    }

    getFiguresFromSelection(topLeft, bottomRight) {
        let figures = [];

        for (let child of this.children)
            if (child instanceof Group)
                figures = figures.concat(child.getFiguresFromSelection(topLeft, bottomRight));
            else if (child.isInSelection(topLeft, bottomRight)) figures.push(child);

        return figures;
    }

    set domElement(element) {
        this._domElement = element;
        this.updateHTML();
    }

    updateHTML() {
        if (this.parent)
            this.parent.updateHTML();

        if (this._domElement) {
            this._domElement.innerHTML = this.toHTML();
            if (CANVAS.selectedFigure)
                CANVAS.selectById(CANVAS.selectedFigure.id);
        }
    }

    findById(id) {
        id = parseInt(id);
        if (id === this.id)
            return this;
        for (let child of this.children) {
            if (child.id === id)
                return child;
            else if (child instanceof Group) {
                let found = child.findById(id);
                if (found) return found;
            }
        }
        return undefined;
    }

    remove(figure) {
        this.children.remove(figure);
        for (let child of this.children)
            if (child instanceof Group)
                child.remove(figure);
    }

    toHTML() {
        let result = `<group onmousedown='CANVAS.startDragging(event)'><group-name onclick='CANVAS.selectById(${this.id})' onmouseup='CANVAS.addToGroup(event)' id='${this.id}'>Group</group-name><group-items>`;
        for (let item of this.children)
            result += item.toHTML();

        return result + `</group-items>
        </group>`;
    }

    get string() {
        let result='';
        for (let caption of this.captions)
            result += caption.toString(this.indentation);
        result += '\t'.repeat(this.indentation);
        return result + `group ${this.children.length}\n`;
    }
}
