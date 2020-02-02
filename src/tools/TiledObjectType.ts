export enum TiledObjectType {
	DEFAULT,
	POINT,
	POLYGON,
	POLYLINE,
	ELLIPSE,
	TEXT,
	IMAGE,
}

// https://doc.mapeditor.org/en/stable/reference/json-map-format/

export function Objectype(meta: any): TiledObjectType {
	if (meta.properties && meta.properties.container) return TiledObjectType.DEFAULT;
	if (meta.gid || meta.image) return TiledObjectType.IMAGE;
	if (meta.text != undefined) return TiledObjectType.TEXT;
	if (meta.point) return TiledObjectType.POINT;
	if (meta.polygon) return TiledObjectType.POLYGON;
	if (meta.polyline) return TiledObjectType.POLYLINE;
	if (meta.ellipse) return TiledObjectType.ELLIPSE;

	return TiledObjectType.DEFAULT;
}