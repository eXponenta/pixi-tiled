export default class MultiSpritesheet {
    constructor(sheets) {
        this.sheets = [];
        this.images = {};
        if (sheets) {
            sheets.forEach(element => {
                this.add(element);
            });
        }
    }
    add(sheet) {
        if (!sheet)
            throw "Sheet can't be undefined";
        this.sheets.push(sheet);
    }
    addTexture(tex, id) {
        this.images[id] = tex;
    }
    get textures() {
        let map = {};
        for (const spr of this.sheets) {
            Object.assign(map, spr.textures);
        }
        Object.assign(map, this.images);
        return map;
    }
    get animations() {
        let map = {};
        for (const spr of this.sheets) {
            Object.assign(map, spr.animations);
        }
        return map;
    }
}
