import { ITiledTileset, ITiledTile } from '../ITiledMap';
import { MultiSpritesheet } from './TiledMultiSheet';
import { resolveTile } from './Utils';

import { Spritesheet } from '@pixi/spritesheet';
import { Rectangle } from '@pixi/math';
import { Texture, BaseTexture, ImageResource } from '@pixi/core';
import { EventEmitter } from '@pixi/utils';

export class TilesetManager extends EventEmitter {
	private _sheet: MultiSpritesheet = new MultiSpritesheet();
	private _loadQueue: number = 0;

	/**
	 * @description Base url for all images
	 */
	public baseUrl: string = '';

	/**
	 * @description Preload images which not exist in spritesheet
	 */
	public loadUnknowImages: boolean = true;

	constructor(private _tileSets: ITiledTileset[], sheet?: MultiSpritesheet | Spritesheet | Record<string, Texture<any>>) {
		super();

		if (sheet) {
			if (sheet!.textures) {
				this.register(sheet as MultiSpritesheet);
			} else {
				Object.keys(sheet).forEach(e => {
					this._sheet.addTexture((sheet as Record<string, Texture>)[e], e);
				});
			}
		}
	}

	register(spritesheet: MultiSpritesheet | Spritesheet) {
		this._sheet.add(spritesheet);
	}

	get spritesheet() {
		return this._sheet;
	}

	getTileByGid(gid: number, tryLoad = this.loadUnknowImages): ITiledTile | undefined {
		const tile = resolveTile(this._tileSets, gid);
		return this.getTileByTile(tile, tryLoad);
	}

	getTileByTile(tile: ITiledTile | null, tryLoad = this.loadUnknowImages, skipAnim = false) {
		if (!tile) {
			return undefined;
		}
		const set = this._tileSets[tile.tilesetId!];

		if(!tile.image && set.image) {
			tile.fromSheet = true;
			tile.image = set.image;
		}

		if(!tile.image) {
			return undefined;
		};

		if (tile.animation && !skipAnim) {
			tile.animation.forEach(e => {
				const atile = set.tiles!.filter(obj => obj.id == e.tileid)[0];
				atile.tilesetId = tile.tilesetId;
				e.texture = this.getTileByTile(atile, tryLoad, true)!.texture;
				e.time = e.duration;
			});
		}

		let texture = this.spritesheet.textures[tile.image];

		tile.lazyLoad = !(texture != undefined && texture.valid);

		const absUrl = this._relativeToAbsolutePath(this.baseUrl, tile.image!);
		//Texture not found by relative path
		if (!texture) {
			//Try to find by absolute path
			texture = this.spritesheet.textures[absUrl];
		}

		if (!texture && tryLoad) {
			texture = this._tryLoadTexture(absUrl, tile);

			tile.lazyLoad = true;

			this._sheet.addTexture(texture, tile.image);
		}

		if(texture && tile.fromSheet) {
			texture = this._cropTile(set, tile, texture);
		}

		tile.texture = texture;
		return tile;
	}

	getTileSetByGid(gid: number): ITiledTileset | undefined {
		const frame = resolveTile(this._tileSets, gid);
		
		if(!frame) {
			return undefined;
		}

		return this._tileSets[frame!.tilesetId];
	}

	_relativeToAbsolutePath(base: String, relative: String) {
		var stack = base.split("/"),
				parts = relative.split("/");
		stack.pop();
		for (var i=0; i<parts.length; i++) {
				if (parts[i] == ".")
						continue;
				if (parts[i] == "..")
						stack.pop();
				else
						stack.push(parts[i]);
		}

		//Remove trailing dot
		if (stack[0] == '.')
		{
			stack.shift();
		}
		
		return stack.join("/");
	}

	_cropTile(set: ITiledTileset, tile: ITiledTile, texture: Texture) {
		
		const colls = set.columns!;
		const rows = set.tilecount! / colls;
		const margin = set.margin! || 0;
		const space = set.spacing! || 0;
		const xId = tile.id % colls;
		const yId = tile.id / colls | 0;

		texture = new Texture(texture.baseTexture, new Rectangle(
			texture._frame.x + margin + xId * (set.tilewidth! + space),
			texture._frame.y + margin + yId * (set.tileheight! + space),
			set.tilewidth, set.tileheight
		));

		this._sheet.addTexture(texture, `${tile.image}_${tile.tilesetId}:${tile.id}`);

		return texture;
	}

	_tryLoadTexture(url: string, tile: ITiledTile) {
		// @ts-ignore
		const res = new ImageResource(url, {
			autoLoad: false,
			crossorigin: 'anonymous',
		});

		const texture = new Texture(new BaseTexture(res));
		Texture.addToCache(texture, url);

		this._loadQueue++;

		res.load()
			.then(() => {
				texture.emit('loaded');
			})
			.catch((e: any)=>{
				console.warn(`Tile set image loading error!`,tile);
			})
			.finally(() => {
				this._loadQueue--;
				if (this._loadQueue === 0) {
					this.emit('loaded');
				}
			});

		return texture;
	}

	get loaded() {
		return this._loadQueue <= 0;
	}
}
