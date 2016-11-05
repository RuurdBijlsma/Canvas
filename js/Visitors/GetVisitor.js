
class GetVisitor extends Visitor {
    // Usage:
    // v = new GetVisitor('x', Infinity, (lowest, check) => check < lowest ? check : lowest);
    // CANVAS.figures.accept(v);
    // console.log('x van group: ', v.result);
    visit(instance) {
        this.result = this.operation(this.result || this.value, instance[this.property]);
    }
}