class Figure {
    constructor(position, width, height, color, zIndex) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;

        this.calculateGrabPoints();

        this.zIndexUpdated = function() {};
        this.zIndex = zIndex;
    }
    commitMove(position) {
        //command endposition
    }
    setSize(pointA, pointB) {
        let xs = [pointA.x, pointB.x].sort((a, b) => a - b),
            ys = [pointA.y, pointB.y].sort((a, b) => a - b);
        pointA.x = xs[0];
        pointA.y = ys[0];
        pointB.x = xs[1];
        pointB.y = ys[1];
        this.position = pointA;
        this.width = pointB.x - pointA.x;
        this.height = pointB.y - pointA.y;
    }
    commitResize(corner1, corner2) {

    }
    set width(val) {
        if (val < 0)
            val = 0;
        this._width = val;
    }
    get width() {
        return this._width;
    }
    get cornerPoints() {
        return {
            topLeft: this.position.clone(),
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
                    this.position.x,
                    this.position.y + this.height / 2
                ),
                action: function(mousePos) {
                    if (mousePos.x >= figure.position.x + figure.width) {
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
                    this.position.x + this.width,
                    this.position.y + this.height / 2
                ),
                action: function(mousePos) {
                    if (mousePos.x <= figure.position.x) {
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
                    this.position.x + this.width / 2,
                    this.position.y
                ),
                action: function(mousePos) {
                    if (mousePos.y >= figure.position.y + figure.height) {
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
                    this.position.x + this.width / 2,
                    this.position.y + this.height
                ),
                action: function(mousePos) {
                    if (mousePos.y <= figure.position.y) {
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
                    this.position.x,
                    this.position.y
                ),
                action: function(mousePos) {
                    if (mousePos.x >= figure.position.x + figure.width) {
                        figure.selectedGrabPoint = figure.grabPoints.topRight;
                        figure.setSize(new Vector2(figure.cornerPoints.topRight.x, mousePos.y), figure.cornerPoints.bottomRight);
                    } else if (mousePos.y >= figure.position.y + figure.height) {
                        figure.selectedGrabPoint = figure.grabPoints.bottomLeft;
                        figure.setSize(new Vector2(mousePos.x, figure.cornerPoints.bottomLeft.y), figure.cornerPoints.bottomRight);
                    } else {
                        figure.setSize(mousePos.clone(), figure.cornerPoints.bottomRight);
                    }
                }
            },
            topRight: {
                position: new Vector2(
                    this.position.x + this.width,
                    this.position.y
                ),
                action: function(mousePos) {
                    if (mousePos.x <= figure.position.x) {
                        figure.selectedGrabPoint = figure.grabPoints.topLeft;
                        figure.setSize(new Vector2(figure.cornerPoints.topLeft.x, mousePos.y), figure.cornerPoints.bottomLeft);
                    } else if (mousePos.y >= figure.position.y + figure.height) {
                        figure.selectedGrabPoint = figure.grabPoints.bottomRight;
                        figure.setSize(new Vector2(mousePos.x, figure.cornerPoints.bottomRight.y), figure.cornerPoints.bottomLeft);
                    } else {
                        figure.setSize(mousePos.clone(), figure.cornerPoints.bottomLeft);
                    }
                }
            },
            bottomLeft: {
                position: new Vector2(
                    this.position.x,
                    this.position.y + this.height
                ),
                action: function(mousePos) {
                    if (mousePos.x >= figure.position.x + figure.width) {
                        figure.selectedGrabPoint = figure.grabPoints.bottomRight;
                        figure.setSize(new Vector2(figure.cornerPoints.bottomRight.x, mousePos.y), figure.cornerPoints.topRight);
                    } else if (mousePos.y <= figure.position.y){
                        figure.selectedGrabPoint = figure.grabPoints.topLeft;
                        figure.setSize(new Vector2(mousePos.x, figure.cornerPoints.topLeft.y), figure.cornerPoints.topRight);
                    }
                    else {
                        figure.setSize(mousePos.clone(), figure.cornerPoints.topRight);
                    }
                }
            },
            bottomRight: {
                position: new Vector2(
                    this.position.x + this.width,
                    this.position.y + this.height
                ),
                action: function(mousePos) {
                    if (mousePos.x <= figure.position.x) {
                        figure.selectedGrabPoint = figure.grabPoints.bottomLeft;
                        figure.setSize(new Vector2(figure.cornerPoints.bottomLeft.x, mousePos.y), figure.cornerPoints.topLeft);
                    } else if (mousePos.y <= figure.position.y) {
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
    isInFigure(position) {
        return position.x >= this.position.x && position.x <= this.position.x + this.width && position.y >= this.position.y && position.y <= this.position.y + this.height;
    }
    set zIndex(val) {
        this._zIndex = val;
        this.zIndexUpdated();
    }
    get zIndex() {
        return this._zIndex;
    }
}
