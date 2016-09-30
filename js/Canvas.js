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

        this.figures = new FigureCollection(
            new Rectangle(new Vector2(20, 20), 40, 30, '#ff0000', 1),
            new Ellipsis(new Vector2(20, 40), 120, 50, '#00ff00', 2)
        );

        this.mouseInfo = {
            position: new Vector2(),
            mouseDown: false
        };
        element.addEventListener('mousedown', function() {
            canvas.handleMouseDown();
        }, false);
        element.addEventListener('mouseup', function() {
            canvas.handleMouseUp();
        }, false);
        element.addEventListener('mousemove', function(e) {
            let x = e.pageX - canvas.element.offsetLeft,
                y = e.pageY - canvas.element.offsetTop;
            canvas.handleMove(x, y);
        }, false);

        element.addEventListener('touchstart', function(e) {
            let x = e.touches[0].pageX - canvas.element.offsetLeft,
                y = e.touches[0].pageY - canvas.element.offsetTop;
            canvas.handleMove(x, y);

            canvas.handleMouseDown();
        }, false);
        element.addEventListener('touchend', function() {
            canvas.handleMouseUp();
        }, false);
        element.addEventListener('touchmove', function(e) {
            let x = e.touches[0].pageX - canvas.element.offsetLeft,
                y = e.touches[0].pageY - canvas.element.offsetTop;

            canvas.handleMove(x, y);
        }, false);

        this.render();
    }

    handleMove(x, y) {
        this.mouseInfo.position.x = x;
        this.mouseInfo.position.y = y;

        if (this.figures.selected && this.figures.selected.selectedGrabPoint)
            this.figures.selected.selectedGrabPoint.action(this.mouseInfo.position);

        if (this.movePoint) {
            this.figures.selected.position.x = this.mouseInfo.position.x - this.movePoint.x;
            this.figures.selected.position.y = this.mouseInfo.position.y - this.movePoint.y;
        }
    }
    handleMouseDown() {
        this.mouseInfo.mouseDown = true;

        if(!this.figures.selected)
            this.figures.selected = this.figures.getFigure(this.mouseInfo.position);
        if (this.figures.selected) {
            for (let grabPoint in this.figures.selected.grabPoints)
                if (this.figures.selected.grabPoints[grabPoint].position.distanceTo(this.mouseInfo.position) < 10) {
                    this.figures.selected.selectedGrabPoint = this.figures.selected.grabPoints[grabPoint];
                    break;
                }

            if (!this.figures.selected.selectedGrabPoint)
                if (this.figures.selected.isInFigure(this.mouseInfo.position)) {
                    this.movePoint = this.mouseInfo.position.clone().sub(this.figures.selected.position);
                }
            if (!this.figures.selected.selectedGrabPoint && !this.movePoint){
                this.figures.selected = this.figures.getFigure(this.mouseInfo.position);
                this.handleMouseDown();
            }
        }
    }

    handleMouseUp() {
        this.mouseInfo.mouseDown = false;

        if (this.figures.selected) {
            if (this.movePoint) {
                delete this.movePoint;
                this.figures.selected.calculateGrabPoints();
            } else {
                delete this.figures.selected.selectedGrabPoint;
                this.figures.selected.calculateGrabPoints();
            }
        }
    }

    render() {
        this.context.clearRect(0, 0, this.width, this.height);

        for (let figure of this.figures)
            figure.draw(this);

        if (this.figures.selected) {
            this.context.strokeStyle = '#aa4400';
            this.context.lineWidth = 2;
            this.context.strokeRect(this.figures.selected.position.x, this.figures.selected.position.y, this.figures.selected.width, this.figures.selected.height);
        }

        let canvas = this;
        requestAnimationFrame(function() {
            canvas.render();
        });
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
            console.log('2');
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
