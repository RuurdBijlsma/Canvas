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
    sub(vector, y) {
        if (y) {
            this.x -= vector;
            this.y -= y;
        } else {
            this.x -= vector.x;
            this.y -= vector.y;
        }
        return this;
    }
    add(vector, y) {
        if (y === 0 || y) {
            this.x += vector;
            this.y += y;
        } else {
            this.x += vector.x;
            this.y += vector.y;
        }
        return this;
    }
}
