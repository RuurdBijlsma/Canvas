class ActionVisitor extends Visitor {
    constructor(property, parameter = '', value = '', operation = (a, b) => a + b) {
        super(property, value, operation);
        this.parameter = parameter;
    }
    visit(instance) {
        this.result = this.operation(this.result || this.value, instance[this.property](this.parameter));
    }
}
