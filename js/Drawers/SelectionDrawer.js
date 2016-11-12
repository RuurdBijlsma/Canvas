class SelectionDrawer extends Singleton {
    draw(context, x, y, width, height) {
        context.fillStyle = 'rgba(0, 120, 200, 0.4)';
        context.fillRect(x, y, width, height);
    }
    get name() {
        return 'rectangle'
    }
}
