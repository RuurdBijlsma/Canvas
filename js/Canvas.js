class Canvas {
    constructor(element) {
        this.element = element;
        this.context = element.getContext('2d');

        this.ratio = 16 / 9;
        this.width = 1000;
        this.height = 1000;

        this.setCanvasSize(this);
        let canvas = this;
        window.addEventListener('resize', function() {
            canvas.setCanvasSize(canvas);
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
            canvas.mouseInfo.mouseDown = true;
            canvas.handleMouseDown();
        }, false);
        element.addEventListener('mouseup', function() {
            canvas.mouseInfo.mouseDown = false;
            canvas.handleMouseUp();
        }, false);
        element.addEventListener('mousemove', function(e) {
            canvas.handleMove(e);
        }, false);

        this.render(this);
    }

    handleMove(event) {
        let x = event.pageX - canvas.element.offsetLeft,
            y = event.pageY - canvas.element.offsetTop;
        canvas.mouseInfo.position.x = x;
        canvas.mouseInfo.position.y = y;

        if(canvas.figures.selected && canvas.figures.selected.selectedGrabPoint)
            canvas.figures.selected.selectedGrabPoint.action(canvas.mouseInfo.position);
    }
    handleMouseDown(){
        if(this.figures.selected)
            for (let grabPoint in this.figures.selected.grabPoints)
                if (this.figures.selected.grabPoints[grabPoint].position.distanceTo(this.mouseInfo.position) < 10){
                    this.figures.selected.selectedGrabPoint = this.figures.selected.grabPoints[grabPoint];
                    break;
                }
    }

    handleMouseUp(){
        if(this.figures.selected)
            if(!this.figures.selected.selectedGrabPoint)
                this.figures.selected = this.figures.getFigure(this.mouseInfo.position);
            else{
                this.figures.selected.selectedGrabPoint = undefined;
                this.figures.selected.calculateGrabPoints();
            }
        else
            this.figures.selected = this.figures.getFigure(this.mouseInfo.position);
    }

    render(canvas) {
        canvas.context.clearRect(0, 0, canvas.width, canvas.height);

        for (let figure of canvas.figures)
            figure.draw(canvas);

        if (canvas.figures.selected) {
            canvas.context.strokeStyle = '#aa4400';
            canvas.context.lineWidth = 2;
            canvas.context.strokeRect(canvas.figures.selected.position.x, canvas.figures.selected.position.y, canvas.figures.selected.width, canvas.figures.selected.height);
        }

        requestAnimationFrame(function() {
            canvas.render(canvas);
        });
    }

    setCanvasSize(canvas) {
        canvas.context.clearRect(0, 0, canvas.width, canvas.height);

        let windowWidth = window.innerWidth,
            windowHeight = window.innerHeight,
            windowRatio = windowWidth / windowHeight;

        if (windowRatio > canvas.ratio) {
            canvas.width = windowHeight * canvas.ratio;
            canvas.height = windowHeight;

            canvas.element.style.top = '0px';
            canvas.element.style.left = 'calc(50% - ' + canvas.width / 2 + 'px)';
        } else {
            console.log('2');
            canvas.width = windowWidth;
            canvas.height = windowWidth / canvas.ratio;

            canvas.element.style.top = 'calc(50% - ' + canvas.height / 2 + 'px)';
            canvas.element.style.left = '0px';
        }

        canvas.element.style.width = canvas.width + 'px';
        canvas.element.style.height = canvas.height + 'px';

        canvas.element.width = canvas.width;
        canvas.element.height = canvas.height;
    }
}
