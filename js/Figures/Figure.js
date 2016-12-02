class Figure {
    constructor(parent, x, y, width, height, zIndex = 0, decorated = false) {
        if (decorated)
            return;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.parent = parent;

        if (!Figure.figureAmount) Figure.figureAmount = 0;
        this.id = Figure.figureAmount++;

        this.zIndexUpdated = function() {};
        this.zIndex = zIndex;
        this.grabPoints = new GrabPointCalculator(this);
    }

    draw(context) {
    }

    accept(visitor) {
        visitor.visit(this);
    }

    get position() {
        return new Vector2(this.x, this.y);
    }

    set width(width) {
        this._width = width >= 0 ? width : this.width;
    }
    get width() {
        return this._width;
    }

    set height(height) {
        this._height = height >= 0 ? height : this.height;
    }
    get height() {
        return this._height;
    }

    set x(x) {
        this._x = x;
    }
    get x() {
        return this._x;
    }

    set y(y) {
        this._y = y;
    }
    get y() {
        return this._y;
    }

    get cornerPoints() {
        return {
            topLeft: this.position,
            bottomRight: this.position.add(this.width, this.height),
            topRight: this.position.add(this.width, 0),
            bottomLeft: this.position.add(0, this.height)
        }
    }

    get sides() {
        return {
            top: this.position.add(this.width / 2, 0),
            bottom: this.position.add(this.width / 2, this.height),
            left: this.position.add(0, this.height / 2),
            right: this.position.add(this.width, this.height / 2),
        }
    }

    findById(id){
        if(id===this.id)
            return this;
        else return undefined;
    }

    fixPoints(pointA, pointB) {
        let xs = [pointA.x, pointB.x].sort((a, b) => a - b),
            ys = [pointA.y, pointB.y].sort((a, b) => a - b);
        pointA.x = xs[0];
        pointA.y = ys[0];
        pointB.x = xs[1];
        pointB.y = ys[1];
        return [pointA, pointB];
    }

    setSize(pointA, pointB) {
        this.fixPoints(pointA, pointB);
        this.x = pointA.x;
        this.y = pointA.y;
        this.width = pointB.x - pointA.x;
        this.height = pointB.y - pointA.y;
    }

    drawBoundingBox(canvas) {
        let boundingColor = 'maroon';
        canvas.context.strokeStyle = boundingColor;
        canvas.context.fillStyle = boundingColor;
        canvas.context.lineWidth = 2;
        canvas.context.strokeRect(this.x, this.y, this.width, this.height);
        for (let grabPoint in this.grabPoints.positions) { // draw every grab point
            let pos = this.grabPoints.positions[grabPoint];
            canvas.context.beginPath();
            canvas.context.ellipse(pos.x, pos.y, canvas.grabPointSize / 2, canvas.grabPointSize / 2, 0, Math.PI * 2, 0);
            canvas.context.fill();
        }
    }

    isInFigure(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height ? this : false;
    }

    isInSelection(topLeft, bottomRight) {
        let cornerPoints = this.cornerPoints,
            left = topLeft.x,
            right = bottomRight.x,
            top = topLeft.y,
            bottom = bottomRight.y;
        return (cornerPoints.topLeft.x > left && cornerPoints.bottomRight.x < right) &&
            (cornerPoints.topLeft.y > top && cornerPoints.bottomRight.y < bottom);
    }

    set zIndex(val) {
        this._zIndex = val;
        this.zIndexUpdated();
    }

    get zIndex() {
        return this._zIndex;
    }

    toHTML() {
        return `<item id='${this.id}' onclick='CANVAS.selectById(${this.id})' onmousedown='CANVAS.startDragging(event)'>${this.constructor.name}</item>`;
    }

    toString() {
        let stringVisitor = new GroupVisitor('string', '');
        this.accept(stringVisitor);
        return stringVisitor.result;
    }

    get name() {
        return this.constructor.name.toLowerCase();
    }

    get indentation() {
        if (!this.parent)
            return -1;
        else
            return this.parent.indentation + 1;
    }

    get string() {
        let result = '';
        for (let caption of this.captions)
            result += caption.toString(this.indentation);
        result += '\t'.repeat(this.indentation);
        return result + `${this.name} ${this.x} ${this.y} ${this.width} ${this.height}\n`;
    }
}
