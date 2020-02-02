import { Spritesheet, Texture } from "pixi.js";

export class MultiSpritesheet {
	sheets: Array<Spritesheet | MultiSpritesheet> = [];
	images: { [name: string]: Texture } = {};

	constructor(sheets?: Spritesheet[]) {
		if (sheets) {
			sheets.forEach(element => {
				this.add(element);
			});
		}
	}

	add(sheet?: Spritesheet | MultiSpritesheet) {
		if (!sheet) throw "Sheet can't be undefined";
		if (sheet === this) throw "U can't add self to spritesheet";

		this.sheets.push(sheet);
	}

	addTexture(tex: Texture, id: string) {
		this.images[id] = tex;
	}

	get textures(): { [name: string]: Texture } {
		let map: { [name: string]: Texture } = {};

		for (const spr of this.sheets) {
			Object.assign(map, spr.textures);
		}

		Object.assign(map, this.images);

		return map;
	}

	get animations(): { [name: string]: Texture[] } {
		let map: { [name: string]: Texture[] } = {};

		for (const spr of this.sheets) {
			// can be looped
			Object.assign(map, spr.animations);
		}

		return map;
	}
}
