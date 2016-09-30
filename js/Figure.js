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
    set width(val) {
        if (val < 0)
            val = 0;
        this._width = val;
    }
    get width() {
        return this._width;
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
                    if (mousePos.x >= figure.position.x + figure.width)
                        figure.selectedGrabPoint = figure.grabPoints.right;
                    else {
                        figure.width += figure.position.x - mousePos.x;
                        figure.position.x = mousePos.x;
                    }
                }
            },
            right: {
                position: new Vector2(
                    this.position.x + this.width,
                    this.position.y + this.height / 2
                ),
                action: function(mousePos) {
                    if (mousePos.x <= figure.position.x)
                        figure.selectedGrabPoint = figure.grabPoints.left;
                    else {
                        figure.width = mousePos.x - figure.position.x;
                    }
                }
            },
            top: {
                position: new Vector2(
                    this.position.x + this.width / 2,
                    this.position.y
                ),
                action: function(mousePos) {
                    if (mousePos.y >= figure.position.y + figure.height)
                        figure.selectedGrabPoint = figure.grabPoints.bottom;
                    else {
                        figure.height += figure.position.y - mousePos.y;
                        figure.position.y = mousePos.y;
                    }
                }
            },
            bottom: {
                position: new Vector2(
                    this.position.x + this.width / 2,
                    this.position.y + this.height
                ),
                action: function(mousePos) {
                    if (mousePos.y <= figure.position.y)
                        figure.selectedGrabPoint = figure.grabPoints.top;
                    else {
                        figure.height = mousePos.y - figure.position.y;
                    }
                }
            },
            topLeft: {
                position: new Vector2(
                    this.position.x,
                    this.position.y
                ),
                action: function(mousePos) {
                    if (mousePos.x >= figure.position.x + figure.width)
                        figure.selectedGrabPoint = figure.grabPoints.topRight;
                    else if (mousePos.y >= figure.position.y + figure.height)
                        figure.selectedGrabPoint = figure.grabPoints.bottomLeft;
                    else {
                        figure.height += figure.position.y - mousePos.y;
                        figure.position.y = mousePos.y;
                        figure.width += figure.position.x - mousePos.x;
                        figure.position.x = mousePos.x;
                    }
                }
            },
            topRight: {
                position: new Vector2(
                    this.position.x + this.width,
                    this.position.y
                ),
                action: function(mousePos) {
                    if (mousePos.x <= figure.position.x)
                        figure.selectedGrabPoint = figure.grabPoints.topLeft;
                    else if (mousePos.y >= figure.position.y + figure.height)
                        figure.selectedGrabPoint = figure.grabPoints.bottomRight;
                    else {
                        figure.height += figure.position.y - mousePos.y;
                        figure.position.y = mousePos.y;
                        figure.width = mousePos.x - figure.position.x;
                    }
                }
            },
            bottomLeft: {
                position: new Vector2(
                    this.position.x,
                    this.position.y + this.height
                ),
                action: function(mousePos) {
                    if (mousePos.x >= figure.position.x + figure.width)
                        figure.selectedGrabPoint = figure.grabPoints.bottomRight;
                    else if (mousePos.y <= figure.position.y)
                        figure.selectedGrabPoint = figure.grabPoints.topLeft;
                    else {
                        figure.width += figure.position.x - mousePos.x;
                        figure.position.x = mousePos.x;
                        figure.height = mousePos.y - figure.position.y;
                    }
                }
            },
            bottomRight: {
                position: new Vector2(
                    this.position.x + this.width,
                    this.position.y + this.height
                ),
                action: function(mousePos) {
                    if (mousePos.x <= figure.position.x)
                        figure.selectedGrabPoint = figure.grabPoints.bottomLeft;
                    else if (mousePos.y <= figure.position.y)
                        figure.selectedGrabPoint = figure.grabPoints.topRight;
                    else {
                        figure.width = mousePos.x - figure.position.x;
                        figure.height = mousePos.y - figure.position.y;
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
