class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    distanceTo(vector){
        return Math.sqrt(this.x*this.x + vector.x*vector.x);
    }
}
