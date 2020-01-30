import { ITiledTileset, ITiledMap, IParsedProps, ITiledLayer, ITiledObject, ITiledSprite } from "./ITiledMap";

export function HexStringToHexInt(value: string | number): number {
	if (!value) return 0;

	if (typeof value == "number") return value;

	value = value.length > 7 ? value.substr(3, 6) : value.substr(1, 6);

	try {
		return parseInt(value, 16);
	} catch (e) {
		console.warn("Color parse error:", e.message);
		return 0;
	}
}

export function HexStringToAlpha(value: string | number): number {
	if (!value) return 1;
	if (typeof value == "number") return value;

	if (value.length <= 7) return 1;

	try {
		return parseInt(value.substr(1, 2), 16) / 255.0;
	} catch (e) {
		console.warn("Alpha parse error:", e.message);
		return 1;
	}
}

export enum TiledObjectType {
	DEFAULT,
	POINT,
	POLYGON,
	POLYLINE,
	ELLIPSE,
	TEXT,
	IMAGE
}

// https://doc.mapeditor.org/en/stable/reference/json-map-format/

export function Objectype(meta: any): TiledObjectType {
	if (meta.properties && meta.properties.container)
		return TiledObjectType.DEFAULT;
	if (meta.gid || meta.image) return TiledObjectType.IMAGE;
	if (meta.text != undefined) return TiledObjectType.TEXT;
	if (meta.point) return TiledObjectType.POINT;
	if (meta.polygon) return TiledObjectType.POLYGON;
	if (meta.polyline) return TiledObjectType.POLYLINE;
	if (meta.ellipse) return TiledObjectType.ELLIPSE;

	return TiledObjectType.DEFAULT;
}

export function resolveImageUrl(
	tilesets: ITiledTileset[],
	baseUrl: string,
	gid: number
) {
	let tileSet = undefined; //_data.tilesets[0];

	for (let i = 0; i < tilesets.length; i++) {
		if (tilesets[i].firstgid <= gid) {
			tileSet = tilesets[i];
		}
	}

	if (!tileSet) {
		console.error("Image with gid:" + gid + " not found!");
		return null;
	}

	const realGid = gid - tileSet.firstgid;

	let find = tileSet.tiles!.filter(obj => obj.id == realGid)[0];
	let img = Object.assign({}, find);

	if (!img) {
		console.error("Load res MISSED gid:" + realGid);
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
				if (p.type == "color") {
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
	if (spriteObject.gid) {
		const gid = spriteObject.gid;

		const vFlip = !!(gid & 0x40000000);
		const hFlip = !!(gid & 0x80000000);
		const dFlip = !!(gid & 0x20000000);

		props["vFlip"] = vFlip;
		props["hFlip"] = hFlip;
		props["dFlip"] = dFlip;

		spriteObject.vFlip = vFlip;
		spriteObject.hFlip = hFlip;

		const realGid = gid & ~(0x40000000 | 0x80000000 | 0x20000000);
		spriteObject.gid = realGid;
	}

	layer.parsedProps = props;
}
