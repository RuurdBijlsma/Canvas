class Visitor {
    constructor(property, value, operation = (a, b) => a + b) {
        this.property = property;
        this.value = value;
        this.operation = operation;
    }
}
