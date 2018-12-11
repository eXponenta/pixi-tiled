namespace Tiled.Utils {
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

		if(meta.properties && meta.properties.container) return TiledObjectType.DEFAULT;
		if (meta.gid || meta.image) return TiledObjectType.IMAGE;
		if (meta.text != undefined) return TiledObjectType.TEXT;
		if (meta.point) return TiledObjectType.POINT;
		if (meta.polygon) return TiledObjectType.POLYGON;
		if (meta.polyline) return TiledObjectType.POLYLINE;
		if (meta.ellipse) return TiledObjectType.ELLIPSE;

		return TiledObjectType.DEFAULT;
	}

}
