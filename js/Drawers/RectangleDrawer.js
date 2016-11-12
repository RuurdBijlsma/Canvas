class RectangleDrawer extends Singleton{
	draw(context, figure){
        context.fillRect(figure.x, figure.y, figure.width, figure.height);
	}

    isInFigure(x, y, figure) {
        return x >= figure.x && x <= figure.x + figure.width && y >= figure.y && y <= figure.y + figure.height ? figure : false;
    }

    get name() {
        return 'Rectangle'
    }
}