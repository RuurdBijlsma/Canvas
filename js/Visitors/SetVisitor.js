class SetVisitor extends Visitor {
    // Usage:
    // Verplaatst group met 5 units op de x as
    // v = new SetVisitor('x', 5);
    // CANVAS.figures.accept(v);

    // Resizet group met factor
    // factor = 2;
    // gety = new GetVisitor('y', (lowest, check) => check < lowest ? check : lowest, Infinity);
    // CANVAS.figures.accept(gety);
    // h = new SetVisitor('height', factor, (a, b) => a * b);
    // y = new SetVisitor('y', factor, (a, b) => a + (a - gety.result) * (factor - 1));
    // CANVAS.figures.accept(h);
    // CANVAS.figures.accept(y)
    visit(instance) {
        instance[this.property] = this.operation(instance[this.property], this.value);
    }
}