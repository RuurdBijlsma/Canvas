//redo stuk
//
//onfixbare bug:
//Als je group resized van grabpoint naar andere grabpoint doet ie dom
class Canvas {
    constructor(element) {
        this.element = element;
        this.context = element.getContext('2d');

        this.ratio = 16 / 9;
        this.width = 1000;
        this.height = 1000;
        this.grabPointSize = 10;

        this.setCanvasSize();
        let canvas = this;
        window.addEventListener('resize', () => this.setCanvasSize());

        this.undoStack = new UndoStack();

        this.figures = new Group();
        FileReader.load('IO.txt').then(function(group) {
            canvas.figures = group;
            canvas.figures.domElement = document.getElementById('figure-list');
        });

        this.mouseInfo = {
            position: new Vector2(),
            startPos: new Vector2(),
            mouseDown: false
        };

        this.inputs = {
            xPos: document.getElementById('x'),
            yPos: document.getElementById('y'),
            xSize: document.getElementById('width'),
            ySize: document.getElementById('height'),
            zIndex: document.getElementById('zIndex')
        };
        for (let input in this.inputs)
            this.inputs[input].addEventListener('change', e => this.handlePropertyChange(e));

        let rightMenu = document.getElementById('right-menu');
        rightMenu.addEventListener('mousedown', e => e.stopPropagation());
        rightMenu.addEventListener('touchstart', e => e.stopPropagation());

        document.addEventListener('keydown', e => this.handleKeyDown(e));
        document.addEventListener('mousedown', () => this.handleMouseDown());
        document.addEventListener('mouseup', () => this.handleMouseUp());
        document.addEventListener('mousemove', e => this.handleMove(e.pageX - this.element.offsetLeft, e.pageY - this.element.offsetTop));
        document.addEventListener('touchend', () => this.handleMouseUp());
        document.addEventListener('touchmove', e => this.handleMove(e.touches[0].pageX - this.element.offsetLeft, e.touches[0].pageY - this.element.offsetTop));
        document.addEventListener('touchstart', function(e) {
            let x = e.touches[0].pageX - canvas.element.offsetLeft,
                y = e.touches[0].pageY - canvas.element.offsetTop;
            canvas.handleMove(x, y);
            canvas.handleMouseDown();
        });

        this.render();
    }

    set selectedFigure(figure) {
        this._selectedFigure = figure;
        this.displayFigureInfo(this._selectedFigure);
        if (figure) this.selectById(figure.id);
    }
    get selectedFigure() {
        return this._selectedFigure
    };

    selectById(id) {
        this._selectedFigure = this.figures.findById(id);
        if (this.selectedFigure) this._selectedFigure.calculateGrabPoints();
        let items = document.querySelectorAll('item, group-name');
        for (let item of items) {
            item.removeAttribute('selected');
            if (item.id == id)
                item.setAttribute('selected', '');
        }
        this.displayFigureInfo(this.selectedFigure);
    }

    displayFigureInfo(figure) {
        let infoElement = document.getElementById('figure-info'),
            figureTitle = document.getElementById('figure-title');
        if (!figure) {
            let items = document.querySelectorAll('item, group-name');
            for (let item of items)
                item.removeAttribute('selected');
            infoElement.style.display = 'none';
        } else {
            figureTitle.innerText = figure.constructor.name + ` (ID: ${figure.id})`;
            infoElement.style.display = 'block';
            this.inputs.xPos.value = this.selectedFigure.x;
            this.inputs.yPos.value = this.selectedFigure.y;
            this.inputs.xSize.value = this.selectedFigure.width;
            this.inputs.ySize.value = this.selectedFigure.height;
            this.inputs.zIndex.value = this.selectedFigure.zIndex;
        }
    }

    handlePropertyChange(e) {
        let property = e.target.id,
            value = parseInt(e.target.value),
            cornerPoints = this.selectedFigure.cornerPoints;
        switch (property) {
            case 'width':
                this.undoStack.push(
                    new SetFigureSize(this.selectedFigure, [
                        cornerPoints.topLeft, cornerPoints.bottomRight
                    ], [
                        cornerPoints.topLeft, cornerPoints.bottomRight.clone().add(value, 0)
                    ])
                );
                break;
            case 'height':
                this.undoStack.push(
                    new SetFigureSize(this.selectedFigure, [
                        cornerPoints.topLeft, cornerPoints.bottomRight
                    ], [
                        cornerPoints.topLeft, cornerPoints.bottomRight.clone().add(0, value)
                    ])
                );
                break;
            case 'x':
                this.undoStack.push(
                    new SetFigurePosition(this.selectedFigure, this.selectedFigure.position, this.selectedFigure.position.add(value - this.selectedFigure[property], 0))
                );
                break;
            case 'y':
                this.undoStack.push(
                    new SetFigurePosition(this.selectedFigure, this.selectedFigure.position, this.selectedFigure.position.add(0, value - this.selectedFigure[property]))
                );
                break;
        }
        this.selectedFigure[property] = value;
    }

    handleKeyDown(e) {
        if (e.key === 'z' && e.ctrlKey)
            this.undoStack.undo();
        if (e.key === 'y' && e.ctrlKey)
            this.undoStack.redo();
        if (e.key === 'Delete')
            this.deleteSelected();
    }

    deleteSelected() {
        if (this.selectedFigure) {
            let removal = new RemoveFigure(this.selectedFigure);
            this.undoStack.push(removal);
            removal.execute();
            this.selectedFigure = undefined;
        }
    }

    handleMouseDown() {
        this.mouseInfo.mouseDown = true;

        if (!this.selectedFigure)
            this.selectedFigure = this.figures.getFigure(this.mouseInfo.position.x, this.mouseInfo.position.y);
        if (this.selectedFigure) {
            let closest = Infinity,
                bestGrabber;
            for (let grabPoint in this.selectedFigure.grabPoints) {
                let distance = this.selectedFigure.grabPoints[grabPoint].position.distanceTo(this.mouseInfo.position);
                if (distance < closest) {
                    closest = distance;
                    bestGrabber = this.selectedFigure.grabPoints[grabPoint];
                }
            }

            if (bestGrabber && closest <= this.grabPointSize) {
                this.selectedFigure.selectedGrabPoint = bestGrabber;
                console.log('startresize');
                this.startResizeSize = [this.selectedFigure.cornerPoints.topLeft, this.selectedFigure.cornerPoints.bottomRight];
            }

            if (!this.selectedFigure.selectedGrabPoint)
                if (this.selectedFigure.isInFigure(this.mouseInfo.position.x, this.mouseInfo.position.y)) {
                    console.log('startmove');
                    this.movePoint = this.mouseInfo.position.clone().sub(this.selectedFigure.position);
                    this.startMovePosition = this.selectedFigure.position;
                }
            if (!this.selectedFigure.selectedGrabPoint && !this.movePoint) {
                this.selectedFigure = this.figures.getFigure(this.mouseInfo.position.x, this.mouseInfo.position.y);
            }
        }
        this.displayFigureInfo(this.selectedFigure);
    }

    handleMove(x, y) {
        this.mouseInfo.position.x = x;
        this.mouseInfo.position.y = y;
        let cursorSet = false;

        if (this.figures.getFigure(this.mouseInfo.position.x, this.mouseInfo.position.y)) {
            this.setCursor('move');
            cursorSet = true;
        }

        if (this.selectedFigure && this.selectedFigure.selectedGrabPoint) {
            this.displayFigureInfo(this.selectedFigure);
            this.selectedFigure.selectedGrabPoint.action(this.mouseInfo.position);
            cursorSet = true;
        } else if (this.selectedFigure) {
            for (let grabPoint in this.selectedFigure.grabPoints)
                if (this.selectedFigure.grabPoints[grabPoint].position.distanceTo(this.mouseInfo.position) < this.grabPointSize) {
                    this.setCursor(grabPoint);
                    cursorSet = true;
                }
        }

        if (this.movePoint) {
            this.displayFigureInfo(this.selectedFigure);
            this.selectedFigure.x = this.mouseInfo.position.x - this.movePoint.x;
            this.selectedFigure.y = this.mouseInfo.position.y - this.movePoint.y;
        }

        if (!cursorSet)
            this.setCursor('default');
    }

    handleMouseUp() {
        this.mouseInfo.mouseDown = false;

        if (this.selectedFigure) {
            if (this.movePoint) {
                delete this.movePoint;
                console.log('endmove', this.startMovePosition.distanceTo(this.selectedFigure.position));
                if (this.startMovePosition.distanceTo(this.selectedFigure.position) > 0)
                    this.undoStack.push(new SetFigurePosition(this.selectedFigure, this.startMovePosition, this.selectedFigure.position));
            } else {
                if (this.startResizeSize) {
                    console.log('endresize');
                    let endResizeSize = [this.selectedFigure.cornerPoints.topLeft, this.selectedFigure.cornerPoints.bottomRight],
                        distanceTL = this.startResizeSize[0].distanceTo(endResizeSize[0]),
                        distanceBR = this.startResizeSize[1].distanceTo(endResizeSize[1]);
                    if (distanceTL > 0 || distanceBR > 0)
                        this.undoStack.push(new SetFigureSize(this.selectedFigure, this.startResizeSize, endResizeSize));
                    delete this.selectedFigure.selectedGrabPoint;
                    delete this.startResizeSize;
                }
            }
        }
    }

    render() {
        this.context.clearRect(0, 0, this.width, this.height);

        this.figures.draw(this);

        if (this.selectedFigure) this.selectedFigure.drawBoundingBox(this);

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
