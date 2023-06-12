import {
	ITiledTileset,
	ITiledMap,
	IParsedProps,
	ITiledLayer,
	ITiledObject,
	ITiledSprite,
	ITiledTile
} from '../ITiledMap';

import { Sprite } from '@pixi/sprite';
import { Graphics } from '@pixi/graphics';
import { Config } from '../Config';
import { BuildPrimitive } from './../objects/TiledPrimitives';
import { TiledContainer } from './../objects/TiledContainer';

export function HexStringToHexInt(value: string | number): number {
	if (!value) return 0;

	if (typeof value == 'number') return value;

	value = value.length > 7 ? value.substr(3, 6) : value.substr(1, 6);

	try {
		return parseInt(value, 16);
	} catch (e) {
		console.warn('Color parse error:', e.message);
		return 0;
	}
}

export function HexStringToAlpha(value: string | number): number {
	if (!value) return 1;
	if (typeof value == 'number') return value;

	if (value.length <= 7) return 1;

	try {
		return parseInt(value.substr(1, 2), 16) / 255.0;
	} catch (e) {
		console.warn('Alpha parse error:', e.message);
		return 1;
	}
}

export function resolveTile(tilesets: ITiledTileset[], gid: number) {
	let tileSet = undefined; //_data.tilesets[0];
	let tilesetId = 0;

	for (let i = 0; i < tilesets.length; i++) {
		if (tilesets[i].firstgid <= gid) {
			tileSet = tilesets[i];
			tilesetId = i;
		}
	}

	if (!tileSet) {
		console.error('Image with gid:' + gid + ' not found!');
		return null;
	}

	const realGid = gid - tileSet.firstgid;

	let find = undefined;
	if (tileSet.tiles !== undefined)
	{
		find = tileSet.tiles!.filter(obj => obj.id == realGid)[0];
	}
	if (find === undefined)
	{
		find = {id: realGid} as ITiledTile; 
	}

	let img = Object.assign({}, find, { tilesetId });

	if (!img) {
		console.error('Load res MISSED gid:' + realGid);
		return null;
	}

	return img;
}

export function _prepareProperties(layer: ITiledMap | ITiledLayer | ITiledObject) {
	let props: IParsedProps = {};

	if (layer.properties) {
		if (layer.properties instanceof Array) {
			for (var p of layer.properties) {
				let val = p.value;
				if (p.type == 'color') {
					val = HexStringToHexInt(val as string);
				}
				props[p.name] = val;
			}
		} else {
			// old tiled format
			props = layer.properties;
		}
	}

	const spriteObject = layer as ITiledSprite;

	// http://doc.mapeditor.org/en/stable/reference/tmx-map-format/#tile-flipping
	if (spriteObject.gid > 0) {
		const gid = spriteObject.gid;

		const vFlip = !!(gid & 0x40000000);
		const hFlip = !!(gid & 0x80000000);
		const dFlip = !!(gid & 0x20000000);

		props['vFlip'] = vFlip;
		props['hFlip'] = hFlip;
		props['dFlip'] = dFlip;

		spriteObject.vFlip = vFlip;
		spriteObject.hFlip = hFlip;

		const realGid = gid & ~(0x40000000 | 0x80000000 | 0x20000000);
		spriteObject.gid = realGid;
	}

	layer.parsedProps = props;
}

export function ApplyMeta(meta: ITiledObject | ITiledLayer, target: TiledContainer) {
	target.name = meta.name;
	target.tiledId = meta.id;
	target.width = meta.width || target.width;
	target.height = meta.height || target.height;
	target.rotation = (((meta as ITiledObject).rotation || 0) * Math.PI) / 180.0;

	target.x = (meta.x || 0) + ((meta as ITiledLayer).offsetx || 0);
	target.y = (meta.y || 0) + ((meta as ITiledLayer).offsety || 0);

	target.visible = meta.visible == undefined ? true : meta.visible;
	target.types = meta.type ? meta.type.split(":") : [];

	target.primitive = BuildPrimitive(meta as ITiledObject);

	const props = meta.parsedProps;

	if (props) {
		if (!isNaN(props.opacity as number)) {
			target.alpha = Number(props.opacity);
		}

		//@ts-ignore
		Object.assign(target, props);

		target.properties = props;
	}

	target.source = meta;

	if (Config.debugContainers) {
		setTimeout(() => {
			const rect = new Graphics();

			rect.lineStyle(2, 0xff0000, 0.7)
				.drawRect(target.x, target.y, meta.width, meta.height)
				.endFill();
			if (target instanceof Sprite) {
				rect.y -= target.height;
			}

			target.parent.addChild<any>(rect);
		}, 30);
	}
}