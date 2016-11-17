class Caption extends Figure {
    constructor(text, side = 'top', color = 'black', fontSize = 16, fontFamily = 'consolas') {
        super();
        this.text = text;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.side = side;
        this.color = color;
    }

    draw(context) {
        super.draw(context);
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.fillStyle = this.color;

        this.width = this.textWidth || context.measureText(this.text).width;
        this.height = this.fontSize - 2;

        let drawPosition = this.figure.sides[this.side].add(this.relativePosition[this.side]);

        this.x = drawPosition.x;
        this.y = drawPosition.y - this.height;

        context.fillText(this.text, drawPosition.x, drawPosition.y);
    }

    get relativePosition() {
        return {
            top: new Vector2(-this.width / 2, -7),
            bottom: new Vector2(-this.width / 2, this.height),
            left: new Vector2(-5 - this.width, this.height / 2),
            right: new Vector2(5, this.height / 2),
        }
    }

    toString(indentation) {
        let result = '\t'.repeat(indentation);
        return result + `ornament ${this.side} "${this.text}"\n`;
    }
}
