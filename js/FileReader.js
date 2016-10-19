class FileReader {
    static load(file) {
        return new Promise(function(resolve) {
            fetch(file).then(function(resp) {
                resp.text().then(function(text) {
                    resolve(FileReader.groupify(FileReader.processText(text)));
                });
            });
        });
    }

    static processText(text) {
        let rules = text.split('\n').map(t => t.split('\t')),
            result = [],
            currentGroup = 0;

        for (let rule of rules) {
            let type = rule[rule.length - 1].split(' ')[0],
                tabs = rule.length - 1,
                config = rule[rule.length - 1].substr(type.length + 1).split(' ');

            result.push({
                type: type,
                tabs: tabs,
                config: config
            });
        }
        return result;
    }

    static groupify(result) {
        let initialGroup = { tabs: -1, children: [] },
            lastGroup = initialGroup;
        for (let object of result) {
            if (object.tabs <= lastGroup.tabs)
                lastGroup = lastGroup.parent;

            if (object.type === 'group') {
                let newGroup = { tabs: object.tabs, children: [], parent: lastGroup };
                lastGroup.children.push(newGroup);
                lastGroup = newGroup;
            } else {
                object.parent = lastGroup;
                lastGroup.children.push(object);
            }
        }
        return initialGroup;
    }
}
