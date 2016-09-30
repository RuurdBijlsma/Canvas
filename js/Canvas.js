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
        element.addEventListener('click', function() {
            canvas.handleClick(canvas);
        }, false);
        element.addEventListener('mousedown', function() {
            canvas.mouseInfo.mouseDown = true;
        }, false);
        element.addEventListener('mouseup', function() {
            canvas.mouseInfo.mouseDown = false;
        }, false);
        element.addEventListener('mousemove', function(e) {
            canvas.handleMove(e, canvas);
        }, false);

        this.render(this);
    }

    handleMove(event, canvas) {
        let x = event.pageX - canvas.element.offsetLeft,
            y = event.pageY - canvas.element.offsetTop;
        canvas.mouseInfo.position.x = x;
        canvas.mouseInfo.position.y = y;
    }

    handleClick(canvas) {
        canvas.figures.selected = canvas.figures.getFigure(canvas.mouseInfo.position);
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
