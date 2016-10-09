class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    distanceTo(vector) {
        return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    sub(vector) {
        let figure = this.clone();
        figure.x -= vector.x;
        figure.y -= vector.y;
        return figure;
    }
    add(vector) {
        let figure = this.clone();
        figure.x += vector.x;
        figure.y += vector.y;
        return figure;
    }
    add(x, y) {
        let figure = this.clone();
        figure.x += x;
        figure.y += y;
        return figure;
    }
}
