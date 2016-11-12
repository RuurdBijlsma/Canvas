class Observer {
    constructor(subject) {
        this.subject = subject;
    }
    update() {
        subject.getData(...);
    }
    doSomething() {

        subject.changeData();
    }
}
