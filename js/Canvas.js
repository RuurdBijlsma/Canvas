class Canvas {
    constructor(element) {
        this.element = element;
        this.context = element.getContext('2d');

        this.ratio = 16 / 9;
        this.width = 1000;
        this.height = 1000;

        this.setCanvasSize();
        let canvas = this;
        window.addEventListener('resize', function() {
            canvas.setCanvasSize();
        }, false);

        this.figures = new FigureCollection();
        this.undoStack = new UndoStack();

        IOReader.load('IO.txt').then(group => this.addFigures(group));

        this.mouseInfo = {
            position: new Vector2(),
            startPos: new Vector2(),
            mouseDown: false
        };
        document.addEventListener('mousedown', function(e) {
            canvas.handleMouseDown();
        }, false);
        document.addEventListener('mouseup', function() {
            canvas.handleMouseUp();
        }, false);
        document.addEventListener('mousemove', function(e) {
            let x = e.pageX - canvas.element.offsetLeft,
                y = e.pageY - canvas.element.offsetTop;
            canvas.handleMove(x, y);
        }, false);

        document.addEventListener('touchstart', function(e) {
            let x = e.touches[0].pageX - canvas.element.offsetLeft,
                y = e.touches[0].pageY - canvas.element.offsetTop;
            canvas.handleMove(x, y);

            canvas.handleMouseDown();
        }, false);
        document.addEventListener('touchend', function() {
            canvas.handleMouseUp();
        }, false);
        document.addEventListener('touchmove', function(e) {
            let x = e.touches[0].pageX - canvas.element.offsetLeft,
                y = e.touches[0].pageY - canvas.element.offsetTop;

            canvas.handleMove(x, y);
        }, false);

        this.grabPointSize = 10;

        document.addEventListener('keydown', function(e) {
            canvas.handleKeyDown(e);
        });

        this.render();
    }

    addFigures(group) {
        let x, y, w, h;
        for (let child of group.children) {
            if (child.children)
                this.addFigures(child);
            else
                switch (child.type) {
                    case 'ellipse':
                        x = parseInt(child.config[0]);
                        y = parseInt(child.config[1]);
                        w = parseInt(child.config[2]);
                        h = parseInt(child.config[3]);
                        let ellipsis = new AddEllipsis(x, y, w, h);
                        ellipsis.execute();
                        this.undoStack.push(ellipsis);
                        break;
                    case 'rectangle':
                        x = parseInt(child.config[0]);
                        y = parseInt(child.config[1]);
                        w = parseInt(child.config[2]);
                        h = parseInt(child.config[3]);
                        let rectangle = new AddRectangle(x, y, w, h);
                        rectangle.execute();
                        this.undoStack.push(rectangle);
                        break;
                }
        }
    }

    handleKeyDown(e) {
        if (e.key === 'z' && e.ctrlKey)
            this.undoStack.undo();
        if (e.key === 'y' && e.ctrlKey) {
            e.preventDefault();
            this.undoStack.redo();
        }
    }

    handleMouseDown() {
        this.mouseInfo.mouseDown = true;

        if (!this.figures.selected)
            this.figures.selected = this.figures.getFigure(this.mouseInfo.position);
        if (this.figures.selected) {
            for (let grabPoint in this.figures.selected.grabPoints)
                if (this.figures.selected.grabPoints[grabPoint].position.distanceTo(this.mouseInfo.position) < this.grabPointSize) {
                    this.figures.selected.selectedGrabPoint = this.figures.selected.grabPoints[grabPoint];
                    console.log('startresize');
                    this.startResizeSize = [this.figures.selected.cornerPoints.topLeft, this.figures.selected.cornerPoints.bottomRight];
                    break;
                }

            if (!this.figures.selected.selectedGrabPoint)
                if (this.figures.selected.isInFigure(this.mouseInfo.position)) {
                    console.log('startmove');
                    this.movePoint = this.mouseInfo.position.clone().sub(this.figures.selected.position);
                    this.startMovePosition = this.figures.selected.position.clone();
                }
            if (!this.figures.selected.selectedGrabPoint && !this.movePoint) {
                this.figures.selected = this.figures.getFigure(this.mouseInfo.position);
            }
        }
    }

    handleMove(x, y) {
        this.mouseInfo.position.x = x;
        this.mouseInfo.position.y = y;
        let cursorSet = false;

        for (let figure of this.figures) {
            if (figure.isInFigure(this.mouseInfo.position)) {
                this.setCursor('move');
                cursorSet = true;
            }
        }

        if (this.figures.selected && this.figures.selected.selectedGrabPoint) {
            this.figures.selected.selectedGrabPoint.action(this.mouseInfo.position);
            this.figures.selected.calculateGrabPoints();
            cursorSet = true;
        } else if (this.figures.selected) {
            for (let grabPoint in this.figures.selected.grabPoints)
                if (this.figures.selected.grabPoints[grabPoint].position.distanceTo(this.mouseInfo.position) < this.grabPointSize) {
                    this.setCursor(grabPoint);
                    cursorSet = true;
                }
        }

        if (this.movePoint) {
            this.figures.selected.position.x = this.mouseInfo.position.x - this.movePoint.x;
            this.figures.selected.position.y = this.mouseInfo.position.y - this.movePoint.y;
            this.figures.selected.calculateGrabPoints();
        }

        if (!cursorSet)
            this.setCursor('default');
    }

    handleMouseUp() {
        this.mouseInfo.mouseDown = false;

        if (this.figures.selected) {
            if (this.movePoint) {
                delete this.movePoint;
                console.log('endmove', this.startMovePosition.distanceTo(this.figures.selected.position));
                if (this.startMovePosition.distanceTo(this.figures.selected.position) > 0)
                    this.undoStack.push(new SetFigurePosition(this.figures.selected, this.startMovePosition, this.figures.selected.position));
                this.figures.selected.calculateGrabPoints();
            } else {
                console.log('endresize');
                let endResizeSize = [this.figures.selected.cornerPoints.topLeft, this.figures.selected.cornerPoints.bottomRight],
                    distanceTL = this.startResizeSize[0].distanceTo(endResizeSize[0]),
                    distanceBR = this.startResizeSize[1].distanceTo(endResizeSize[1]);
                if (distanceTL > 0 || distanceBR > 0)
                    this.undoStack.push(new SetFigureSize(this.figures.selected, this.startResizeSize, endResizeSize));
                delete this.figures.selected.selectedGrabPoint;
                this.figures.selected.calculateGrabPoints();
            }
        }
    }

    render() {
        this.context.clearRect(0, 0, this.width, this.height);

        for (let figure of this.figures)
            figure.draw(this);

        if (this.figures.selected) { //draw bounding box
            this.context.strokeStyle = '#aa4400';
            this.context.fillStyle = '#aa4400';
            this.context.lineWidth = 2;
            this.context.strokeRect(this.figures.selected.position.x, this.figures.selected.position.y, this.figures.selected.width, this.figures.selected.height);
            for (let grabPoint in this.figures.selected.grabPoints) { // draw every grab point
                let pos = this.figures.selected.grabPoints[grabPoint].position;
                this.context.beginPath();
                this.context.ellipse(pos.x, pos.y, this.grabPointSize / 2, this.grabPointSize / 2, 0, Math.PI * 2, 0);
                this.context.fill();
            }
        }

        let canvas = this;
        requestAnimationFrame(function() {
            canvas.render();
        });
    }

    setCursor(type) {
        let cursor = 'default';
        switch (type) {
            case 'left':
            case 'right':
                cursor = 'e-resize';
                break;
            case 'top':
            case 'bottom':
                cursor = 's-resize';
                break;
            case 'topRight':
            case 'bottomLeft':
                cursor = 'ne-resize';
                break;
            case 'bottomRight':
            case 'topLeft':
                cursor = 'nw-resize';
                break;
            default:
                cursor = type;
                break;
        }
        this.element.style.cursor = cursor;
    }

    setCanvasSize() {
        this.context.clearRect(0, 0, this.width, this.height);

        let windowWidth = window.innerWidth,
            windowHeight = window.innerHeight,
            windowRatio = windowWidth / windowHeight;

        if (windowRatio > this.ratio) {
            this.width = windowHeight * this.ratio;
            this.height = windowHeight;

            this.element.style.top = '0px';
            this.element.style.left = 'calc(50% - ' + this.width / 2 + 'px)';
        } else {
            this.width = windowWidth;
            this.height = windowWidth / this.ratio;

            this.element.style.top = 'calc(50% - ' + this.height / 2 + 'px)';
            this.element.style.left = '0px';
        }

        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';

        this.element.width = this.width;
        this.element.height = this.height;
    }
}
