class EllipsisDrawer extends Singleton {
    draw(context, figure) {
        context.beginPath();
        context.ellipse(figure.x + figure.width / 2, figure.y + figure.height / 2, figure.width / 2, figure.height / 2, 0, Math.PI * 2, 0);
        context.fill();
    }

    isInFigure(x, y, figure) {
        let cosa = Math.cos(0),
            sina = Math.sin(0),
            halfWidthSquared = figure.width / 2 * figure.width / 2,
            halfHeightSquared = figure.height / 2 * figure.height / 2,
            a = Math.pow(cosa * (x - figure.x - figure.width / 2) + sina * (y - figure.y - figure.height / 2), 2),
            b = Math.pow(sina * (x - figure.x - figure.width / 2) + cosa * (y - figure.y - figure.height / 2), 2),
            ellipse = (a / halfWidthSquared) + (b / halfHeightSquared);

        return ellipse <= 1 ? figure : false;
    }

    get name() {
        return 'Ellipsis'
    }
}
