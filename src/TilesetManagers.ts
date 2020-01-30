import { ITiledTileset, ITiledTile } from './ITiledMap';
import { MultiSpritesheet } from './TiledMultiSheet';
import { resolveImageUrl } from './Utils';

import { Spritesheet, Texture } from 'pixi.js';

export class TilesetManager {
	private _sheet: MultiSpritesheet = new MultiSpritesheet();

	/**
	 * @description Base url for all images
	 */
	public baseUrl: string = '';

	/**
	 * @description Preload images which not exist in spritesheet
	 */
	public loadUnknowImages: boolean = true;

	constructor(private _tileSets: ITiledTileset[], sheet?: MultiSpritesheet | Spritesheet) {
		if (sheet) {
			this.register(sheet);
		}
	}

	register(spritesheet: MultiSpritesheet | Spritesheet) {
		this._sheet.add(spritesheet);
	}

	get spritesheet() {
		return this._sheet;
	}

	getTileByGid(gid: number, tryLoad = this.loadUnknowImages): ITiledTile | undefined {
		const tile = resolveImageUrl(this._tileSets, this.baseUrl, gid);
		return this.getTileByTile(tile, tryLoad);
	}

	getTileByTile(tile: ITiledTile | null, tryLoad = this.loadUnknowImages, skipAnim  = false) {
		if (!tile || !tile.image) {
			return undefined;
		}
		
		if(tile.animation && !skipAnim) {
			const ts =this._tileSets[tile.tilesetId!];
			
			tile.animation.forEach((e)=>{
				e.texture = this.getTileByTile(ts.tiles![e.tileid], tryLoad, true)!.texture;
				e.time = e.duration;
			});
		}

		const absUrl = this.baseUrl + tile.image!;

		let texture = this.spritesheet.textures[tile.image];

		if (!texture && tryLoad) {
			texture = Texture.from(absUrl, {}, false);
			this._sheet.addTexture(texture, tile.image);
		}

		tile.texture = texture;

		return tile;
	}
}
