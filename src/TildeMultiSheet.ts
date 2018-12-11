namespace Tiled {
	export class MultiSpritesheet {

		sheets: PIXI.Spritesheet[] = [];
		images: { [name: string]: PIXI.Texture } = {};

		constructor(sheets?: PIXI.Spritesheet[]) {
			if (sheets) {
				sheets.forEach(element => {
					this.add(element);
				});
			}
		}

		add(sheet?: PIXI.Spritesheet) {
			
			if(!sheet) throw "Sheet can't be undefined";

			this.sheets.push(sheet);
		}

		addTexture(tex: PIXI.Texture, id: string) {
			this.images[id] = tex;
		}

		get textures(): { [name: string]: PIXI.Texture } {
			let map: { [name: string]: PIXI.Texture } = {};

			for (const spr of this.sheets) {
				Object.assign(map, spr.textures);
			}

			Object.assign(map, this.images);

			return map;
		}

		get animations(): { [name: string]: PIXI.Texture[] } {
			let map: { [name: string]: PIXI.Texture[] } = {};

			for (const spr of this.sheets) {
				Object.assign(map, spr.animations);
			}

			return map;
		}
	}
}
