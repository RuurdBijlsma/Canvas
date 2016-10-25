class Figure {
    constructor(parent, x, y, width, height, color, zIndex) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.parent = parent;

        this.calculateGrabPoints();

        this.id = Figure.figureAmount++;

        this.zIndexUpdated = function() {};
        this.zIndex = zIndex;
    }

    static set figureAmount(n) { this._figureAmount = n; };
    static get figureAmount() {
        if (!this._figureAmount)
            this._figureAmount = 0;
        return this._figureAmount;
    };

    get position() {
        return new Vector2(this.x, this.y);
    }

    set width(width) {
        this._width = width >= 0 ? width : 0;
        this.calculateGrabPoints();
    }
    get width() {
        return this._width;
    }

    set height(height) {
        this._height = height >= 0 ? height : 0;
        this.calculateGrabPoints();
    }
    get height() {
        return this._height;
    }

    set x(x) {
        this._x = x;
        this.calculateGrabPoints();
    }
    get x() {
        return this._x;
    }

    set y(y) {
        this._y = y;
        this.calculateGrabPoints();
    }
    get y() {
        return this._y;
    }

    setSize(pointA, pointB) {
        let xs = [pointA.x, pointB.x].sort((a, b) => a - b),
            ys = [pointA.y, pointB.y].sort((a, b) => a - b);
        pointA.x = xs[0];
        pointA.y = ys[0];
        pointB.x = xs[1];
        pointB.y = ys[1];
        this.x = pointA.x;
        this.y = pointA.y;
        this.width = pointB.x - pointA.x;
        this.height = pointB.y - pointA.y;
    }
    get cornerPoints() {
        return {
            topLeft: this.position,
            bottomRight: this.position.add(this.width, this.height),
            topRight: this.position.add(this.width, 0),
            bottomLeft: this.position.add(0, this.height)
        }
    }
    calculateGrabPoints() {
        let figure = this;
        this.grabPoints = {
            left: {
                position: new Vector2(
                    this.x,
                    this.y + this.height / 2
                ),
                action: function(mousePos) {
                    if (mousePos.x >= figure.cornerPoints.topRight.x) {
                        figure.selectedGrabPoint = figure.grabPoints.right;
                        figure.setSize(figure.cornerPoints.bottomRight, figure.cornerPoints.topRight);
                    } else {
                        let topLeft = new Vector2(mousePos.x, figure.cornerPoints.topLeft.y);
                        figure.setSize(topLeft, figure.cornerPoints.bottomRight);
                    }
                }
            },
            right: {
                position: new Vector2(
                    this.x + this.width,
                    this.y + this.height / 2
                ),
                action: function(mousePos) {
                    if (mousePos.x <= figure.x) {
                        figure.selectedGrabPoint = figure.grabPoints.left;
                        figure.setSize(figure.cornerPoints.topLeft, figure.cornerPoints.bottomLeft);
                    } else {
                        let topRight = new Vector2(mousePos.x, figure.cornerPoints.topRight.y);
                        figure.setSize(topRight, figure.cornerPoints.bottomLeft);
                    }
                }
            },
            top: {
                position: new Vector2(
                    this.x + this.width / 2,
                    this.y
                ),
                action: function(mousePos) {
                    if (mousePos.y >= figure.cornerPoints.bottomLeft.y) {
                        figure.selectedGrabPoint = figure.grabPoints.bottom;
                        figure.setSize(figure.cornerPoints.bottomRight, figure.cornerPoints.bottomLeft);
                    } else {
                        let topRight = new Vector2(figure.cornerPoints.topRight.x, mousePos.y);
                        figure.setSize(topRight, figure.cornerPoints.bottomLeft);
                    }
                }
            },
            bottom: {
                position: new Vector2(
                    this.x + this.width / 2,
                    this.y + this.height
                ),
                action: function(mousePos) {
                    if (mousePos.y <= figure.y) {
                        figure.selectedGrabPoint = figure.grabPoints.top;
                        figure.setSize(figure.cornerPoints.topLeft, figure.cornerPoints.topRight);
                    } else {
                        let bottomLeft = new Vector2(figure.cornerPoints.bottomLeft.x, mousePos.y);
                        figure.setSize(bottomLeft, figure.cornerPoints.topRight);
                    }
                }
            },
            topLeft: {
                position: new Vector2(
                    this.x,
                    this.y
                ),
                action: function(mousePos) {
                    if (mousePos.x >= figure.cornerPoints.topRight.x) {
                        figure.selectedGrabPoint = figure.grabPoints.topRight;
                        figure.setSize(new Vector2(figure.cornerPoints.topRight.x, mousePos.y), figure.cornerPoints.bottomRight);
                    } else if (mousePos.y >= figure.cornerPoints.bottomLeft.y) {
                        figure.selectedGrabPoint = figure.grabPoints.bottomLeft;
                        figure.setSize(new Vector2(mousePos.x, figure.cornerPoints.bottomLeft.y), figure.cornerPoints.bottomRight);
                    } else {
                        figure.setSize(mousePos.clone(), figure.cornerPoints.bottomRight);
                    }
                }
            },
            topRight: {
                position: new Vector2(
                    this.x + this.width,
                    this.y
                ),
                action: function(mousePos) {
                    if (mousePos.x <= figure.x) {
                        figure.selectedGrabPoint = figure.grabPoints.topLeft;
                        figure.setSize(new Vector2(figure.cornerPoints.topLeft.x, mousePos.y), figure.cornerPoints.bottomLeft);
                    } else if (mousePos.y >= figure.cornerPoints.bottomRight.y) {
                        figure.selectedGrabPoint = figure.grabPoints.bottomRight;
                        figure.setSize(new Vector2(mousePos.x, figure.cornerPoints.bottomRight.y), figure.cornerPoints.bottomLeft);
                    } else {
                        figure.setSize(mousePos.clone(), figure.cornerPoints.bottomLeft);
                    }
                }
            },
            bottomLeft: {
                position: new Vector2(
                    this.x,
                    this.y + this.height
                ),
                action: function(mousePos) {
                    if (mousePos.x >= figure.cornerPoints.bottomRight.x) {
                        figure.selectedGrabPoint = figure.grabPoints.bottomRight;
                        figure.setSize(new Vector2(figure.cornerPoints.bottomRight.x, mousePos.y), figure.cornerPoints.topRight);
                    } else if (mousePos.y <= figure.y) {
                        figure.selectedGrabPoint = figure.grabPoints.topLeft;
                        figure.setSize(new Vector2(mousePos.x, figure.cornerPoints.topLeft.y), figure.cornerPoints.topRight);
                    } else {
                        figure.setSize(mousePos.clone(), figure.cornerPoints.topRight);
                    }
                }
            },
            bottomRight: {
                position: new Vector2(
                    this.x + this.width,
                    this.y + this.height
                ),
                action: function(mousePos) {
                    if (mousePos.x <= figure.x) {
                        figure.selectedGrabPoint = figure.grabPoints.bottomLeft;
                        figure.setSize(new Vector2(figure.cornerPoints.bottomLeft.x, mousePos.y), figure.cornerPoints.topLeft);
                    } else if (mousePos.y <= figure.y) {
                        figure.selectedGrabPoint = figure.grabPoints.topRight;
                        figure.setSize(new Vector2(mousePos.x, figure.cornerPoints.topRight.y), figure.cornerPoints.topLeft);
                    } else {
                        figure.setSize(mousePos.clone(), figure.cornerPoints.topLeft);
                    }
                }
            }
        }
    }

    draw(canvas) {
        canvas.context.fillStyle = this.color;
    }

    drawBoundingBox(canvas) {
        let boundingColor = 'maroon';
        canvas.context.strokeStyle = boundingColor;
        canvas.context.fillStyle = boundingColor;
        canvas.context.lineWidth = 2;
        canvas.context.strokeRect(this.x, this.y, this.width, this.height);
        for (let grabPoint in this.grabPoints) { // draw every grab point
            let pos = this.grabPoints[grabPoint].position;
            canvas.context.beginPath();
            canvas.context.ellipse(pos.x, pos.y, canvas.grabPointSize / 2, canvas.grabPointSize / 2, 0, Math.PI * 2, 0);
            canvas.context.fill();
        }
    }

    isInFigure(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height ? this : false;;
    }

    set zIndex(val) {
        this._zIndex = val;
        this.zIndexUpdated();
    }

    get zIndex() {
        return this._zIndex;
    }

    toHTML() {
        return `<item id='${this.id}' onclick='CANVAS.selectById(${this.id})'>${this.constructor.name}</item>`;
    }

}
