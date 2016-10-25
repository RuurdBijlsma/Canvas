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
    static groupToFile(group) {
        FileWriter.write(group.toString(), 'group.txt');
    }
}
