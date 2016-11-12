class Subject {
    constructor() {
        this.observers = [];
    }

    attach(observer) {
        this.observers.push(observer);
    }

    detach(observer) {
        let index = this.observers.indexOf(observer);
        this.observer.splice(index, 1);
    }

    notify() {
        for (let observer of this.observers)
            observer.update();
    }
    
    getData(...) {

    }

    changeData() {

        this.notify();
    }
}
