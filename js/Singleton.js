class Singleton {
    constructor() {
        if (this.constructor._instance) return this.constructor._instance;
        this.constructor._instance = this;
    }

    static get instance() {
        return new this;
    }
}