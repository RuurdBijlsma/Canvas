class CaptionDecorator extends FigureDecorator {
    constructor(figure, text, side = 'top', color = 'black', fontSize = 16, fontFamily = 'consolas') {
        super(figure);

        this.text = text;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.side = side;
        this.captionColor = color;
    }

    draw(context) {
        super.draw(context);
        this.drawCaption(context);
    }

    get captionHeight() {
        return this.fontSize - 2;
    }

    drawCaption(context) {
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.fillStyle = this.captionColor;

        this.captionWidth = this.textWidth || context.measureText(this.text).width;

        let drawPosition = this.figure.sides[this.side].add(this.relativeCaptionPosition[this.side]);

        context.fillText(this.text, drawPosition.x, drawPosition.y);
    }

    get relativeCaptionPosition() {
        return {
            top: new Vector2(-this.captionWidth / 2, -7),
            bottom: new Vector2(-this.captionWidth / 2, this.captionHeight),
            left: new Vector2(-5 - this.captionWidth, this.captionHeight / 2),
            right: new Vector2(5, this.captionHeight / 2),
        }
    }

    get string() {
        let result = '\t'.repeat(this.figure.indentation);
        result += `ornament ${this.side} "${this.text}"\n`;

        return result;
    }
}
