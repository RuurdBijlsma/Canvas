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

    get position() {
        return this.cornerPoints.topLeft;
    }
    set position(v) {}
    get height() {
        let points = this.cornerPoints;
        return Math.abs(points.topLeft.y - points.bottomRight.y);
    }
    get width() {
        let points = this.cornerPoints;
        return Math.abs(points.topLeft.x - points.bottomRight.x);
    }
    set height(v) {}
    set width(v) {}

    isInFigure(position) {
        return this.getFigure(position);
    }
    draw(canvas) {
        for (let figure of this.children)
            if (figure.draw)
                figure.draw(canvas);
    }
    getFigure(position) {
        for (let figure of this.children) {
            let selected = figure.isInFigure(position);
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

        if (this._domElement)
            this._domElement.innerHTML = this.toHTML();
    }
    toHTML() {
        let result = `<group><group-name onclick='CANVAS.selectById(${this.id})' id='${this.id}'>Group</group-name><group-items>`;
        for (let item of this.children)
            result += item.toHTML();
        result += `</group-items>
        </group>`;
        return result;
    }
    findById(id) {
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
}
