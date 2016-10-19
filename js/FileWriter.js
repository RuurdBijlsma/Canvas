class FileWriter {
    static write(text, fileName) {
        let blob = new Blob([text], { type: 'text/plain' }),
            a = document.createElement("a");
        a.style = "display: none";
        document.body.appendChild(a);

        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
    }
    static collectionToFile(collection) {
        let rules = [`group ${collection.length}`];
        for (let figure of collection) {
            let text = '\t';
            if (figure instanceof Ellipsis) {
                text += 'ellipse';
            } else if (figure instanceof Rectangle) {
                text += 'rectangle';
            }
            text+=` ${figure.position.x} ${figure.position.y} ${figure.width} ${figure.height}`;
            rules.push(text);
        }
        FileWriter.write(rules.join('\n'), 'collection.txt');
    }
}
