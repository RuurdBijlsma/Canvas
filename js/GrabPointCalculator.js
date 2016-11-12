class GrabPointCalculator {
    constructor(figure) {
        this.figure = figure;
        this.calculate();
    }

    get positions() {
        return {
            left: new Vector2(this.figure.x, this.figure.y + this.figure.height / 2),
            right: new Vector2(this.figure.x + this.figure.width, this.figure.y + this.figure.height / 2),
            top: new Vector2(this.figure.x + this.figure.width / 2, this.figure.y),
            bottom: new Vector2(this.figure.x + this.figure.width / 2, this.figure.y + this.figure.height),
            topLeft: new Vector2(this.figure.x, this.figure.y),
            topRight: new Vector2(this.figure.x + this.figure.width, this.figure.y),
            bottomLeft: new Vector2(this.figure.x, this.figure.y + this.figure.height),
            bottomRight: new Vector2(this.figure.x + this.figure.width, this.figure.y + this.figure.height)
        }
    }

    calculate() {
        let figure = this.figure;
        this._points = {
            left: new GrabPoint(this.positions.left, mouse => {
                if (mouse.x >= figure.cornerPoints.topRight.x) {
                    figure.selectedGrabPoint = figure.grabPoints.right;
                    figure.setSize(figure.cornerPoints.bottomRight, figure.cornerPoints.topRight);
                } else {
                    let topLeft = new Vector2(mouse.x, figure.cornerPoints.topLeft.y);
                    figure.setSize(topLeft, figure.cornerPoints.bottomRight);
                }
            }),
            right: new GrabPoint(this.positions.right, mouse => {
                if (mouse.x <= figure.x) {
                    figure.selectedGrabPoint = figure.grabPoints.left;
                    figure.setSize(figure.cornerPoints.topLeft, figure.cornerPoints.bottomLeft);
                } else {
                    let topRight = new Vector2(mouse.x, figure.cornerPoints.topRight.y);
                    figure.setSize(topRight, figure.cornerPoints.bottomLeft);
                }
            }),
            top: new GrabPoint(this.positions.top, mouse => {
                if (mouse.y >= figure.cornerPoints.bottomLeft.y) {
                    figure.selectedGrabPoint = figure.grabPoints.bottom;
                    figure.setSize(figure.cornerPoints.bottomRight, figure.cornerPoints.bottomLeft);
                } else {
                    let topRight = new Vector2(figure.cornerPoints.topRight.x, mouse.y);
                    figure.setSize(topRight, figure.cornerPoints.bottomLeft);
                }
            }),
            bottom: new GrabPoint(this.positions.bottom, mouse => {
                if (mouse.y <= figure.y) {
                    figure.selectedGrabPoint = figure.grabPoints.top;
                    figure.setSize(figure.cornerPoints.topLeft, figure.cornerPoints.topRight);
                } else {
                    let bottomLeft = new Vector2(figure.cornerPoints.bottomLeft.x, mouse.y);
                    figure.setSize(bottomLeft, figure.cornerPoints.topRight);
                }
            }),
            topLeft: new GrabPoint(this.positions.topLeft, mouse => {
                if (mouse.x >= figure.cornerPoints.topRight.x) {
                    figure.selectedGrabPoint = figure.grabPoints.topRight;
                    figure.setSize(new Vector2(figure.cornerPoints.topRight.x, mouse.y), figure.cornerPoints.bottomRight);
                } else if (mouse.y >= figure.cornerPoints.bottomLeft.y) {
                    figure.selectedGrabPoint = figure.grabPoints.bottomLeft;
                    figure.setSize(new Vector2(mouse.x, figure.cornerPoints.bottomLeft.y), figure.cornerPoints.bottomRight);
                } else {
                    figure.setSize(mouse.clone(), figure.cornerPoints.bottomRight);
                }
            }),
            topRight: new GrabPoint(this.positions.topRight, mouse => {
                if (mouse.x <= figure.x) {
                    figure.selectedGrabPoint = figure.grabPoints.topLeft;
                    figure.setSize(new Vector2(figure.cornerPoints.topLeft.x, mouse.y), figure.cornerPoints.bottomLeft);
                } else if (mouse.y >= figure.cornerPoints.bottomRight.y) {
                    figure.selectedGrabPoint = figure.grabPoints.bottomRight;
                    figure.setSize(new Vector2(mouse.x, figure.cornerPoints.bottomRight.y), figure.cornerPoints.bottomLeft);
                } else {
                    figure.setSize(mouse.clone(), figure.cornerPoints.bottomLeft);
                }
            }),
            bottomLeft: new GrabPoint(this.positions.bottomLeft, mouse => {
                if (mouse.x >= figure.cornerPoints.bottomRight.x) {
                    figure.selectedGrabPoint = figure.grabPoints.bottomRight;
                    figure.setSize(new Vector2(figure.cornerPoints.bottomRight.x, mouse.y), figure.cornerPoints.topRight);
                } else if (mouse.y <= figure.y) {
                    figure.selectedGrabPoint = figure.grabPoints.topLeft;
                    figure.setSize(new Vector2(mouse.x, figure.cornerPoints.topLeft.y), figure.cornerPoints.topRight);
                } else {
                    figure.setSize(mouse.clone(), figure.cornerPoints.topRight);
                }
            }),
            bottomRight: new GrabPoint(this.positions.bottomRight, mouse => {
                if (mouse.x <= figure.x) {
                    figure.selectedGrabPoint = figure.grabPoints.bottomLeft;
                    figure.setSize(new Vector2(figure.cornerPoints.bottomLeft.x, mouse.y), figure.cornerPoints.topLeft);
                } else if (mouse.y <= figure.y) {
                    figure.selectedGrabPoint = figure.grabPoints.topRight;
                    figure.setSize(new Vector2(mouse.x, figure.cornerPoints.topRight.y), figure.cornerPoints.topLeft);
                } else {
                    figure.setSize(mouse.clone(), figure.cornerPoints.topLeft);
                }
            })
        }
    }
    get left() {
        return this._points.left
    }
    get right() {
        return this._points.right
    }
    get top() {
        return this._points.top
    }
    get bottom() {
        return this._points.bottom
    }
    get topLeft() {
        return this._points.topLeft
    }
    get topRight() {
        return this._points.topRight
    }
    get bottomLeft() {
        return this._points.bottomLeft
    }
    get bottomRight() {
        return this._points.bottomRight
    }
}
