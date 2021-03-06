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
            result = [];

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
        let initialGroup = new Group();
        initialGroup.tabs = -1;
        let lastGroup = initialGroup,
            captionsToAdd = [];
        for (let object of result) {
            if (object.tabs <= lastGroup.tabs)
                lastGroup = lastGroup.parent;

            if (object.type === 'group') {
                let newGroup = new Group(lastGroup);
                newGroup.tabs = object.tabs;
                lastGroup.children.push(newGroup);
                lastGroup = newGroup;
            } else {
                let x = parseInt(object.config[0]),
                    y = parseInt(object.config[1]),
                    w = parseInt(object.config[2]),
                    h = parseInt(object.config[3]),
                    color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
                switch (object.type) {
                    case 'ellipse':
                        object = new DrawableFigure(lastGroup, EllipsisDrawer, x, y, w, h, color, 0);
                        break;
                    case 'rectangle':
                        object = new DrawableFigure(lastGroup, RectangleDrawer, x, y, w, h, color, 0);
                        break;
                    case 'ornament':
                        captionsToAdd.push(object);
                        break;
                }
            }
            if (object instanceof Figure)
                lastGroup.children.push(object);

            if (object instanceof Figure || object.type === 'group') {
                if (object.type === 'group')
                    object = lastGroup;
                let parent = object.parent;
                if (captionsToAdd.length) console.log('adding these captions: ', captionsToAdd, 'to : ', object);
                
                for (let caption of captionsToAdd)
                    object = new CaptionDecorator(object, caption.config[1].replace(/"/g, ''), caption.config[0]);

                parent.children.pop();
                parent.children.push(object);
                captionsToAdd = [];
            }
        }
        FileReader.removeTabs(initialGroup);

        if (initialGroup.children[0] instanceof Group && initialGroup.children.length === 1)
            return initialGroup.children[0];
        else
            return initialGroup;
    }
    static removeTabs(group) {
        for (let child of group.children) {
            delete child.tabs;
            if (child instanceof Group)
                FileReader.removeTabs(child);
        }
    }
}
