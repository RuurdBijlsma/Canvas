class SelectionDrawer extends Singleton {
    draw(context, figure) {
        context.fillStyle = 'rgba(0, 120, 200, 0.4)';
        context.fillRect(figure.x, figure.y, figure.width, figure.height);
    }

    get name() {
        return 'selection'
    }
}
