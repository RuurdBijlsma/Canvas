class Group extends Figure {
    constructor(parent, zIndex = 0, ...children) {
        super(parent, new Vector2);
        this.children = new FigureCollection();

        this.children.onChange = () => this.updateHTML();
        this.zIndex = zIndex;
        for (let child of children)
            this.children.push(child);
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
        return this.cornerPoints.topLeft.x;
    }
    get y() {
        return this.cornerPoints.topLeft.y;
    }
    set x(newX) {
        let added = newX - this.x;
        if (this.children)
            for (let child of this.children) {
                child.x += added;
            }
        this.calculateGrabPoints();
    }
    set y(newY) {
        let added = newY - this.y;
        if (this.children)
            for (let child of this.children) {
                child.y += added;
            }
        this.calculateGrabPoints();
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
        if (this.children) {
            let factor = newHeight / this.height;
            for (let child of this.children) {
                newHeight = child.height * factor;
                child.height = newHeight > 0 ? newHeight : child.height;
                let deltaPos = (child.y - this.y) * (factor - 1);
                child.y += deltaPos;
            }
        }
        this.calculateGrabPoints();
    }
    set width(newWidth) {
        if (this.children) {
            let factor = newWidth / this.width;
            for (let child of this.children) {
                newWidth = child.width * factor;
                child.width = newWidth > 0 ? newWidth : child.width;
                let deltaPos = (child.x - this.x) * (factor - 1);
                child.x += deltaPos;
            }
        }
        this.calculateGrabPoints();
    }

    isInFigure(x, y) {
        return this.getFigure(x, y);
    }
    draw(canvas) {
        for (let figure of this.children)
            if (figure.draw)
                figure.draw(canvas);
    }
    getFigure(x, y) {
        for (let i = this.children.length - 1; i >= 0; i--) {
            let selected = this.children[i].isInFigure(x, y);
            if (selected)
                return selected;
        }
        return false;
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

        result += `</group-items>
        </group>`;
        return result;
    }
    toString(tabs = 0) {
        let result = '';
        for (let i = 0; i < tabs; i++)
            result += '\t';

        result += `group ${this.children.filter(child=>!(child instanceof Group)).length}\n`;
        
        for (let child of this.children)
            result += child.toString(tabs + 1);

        return result;
    }
}
