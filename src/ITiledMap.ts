import type { Texture } from "@pixi/core";

export type IPropType = "float" | "int" | "color" | "bool" | "string";

export type ILayerType = "tilelayer" | "objectgroup" | "imagelayer" | "group";

export interface IParsedProps {
    [key: string]: string | number | boolean;
}

export interface IPropDefinition {
	name: string;
	type: IPropType;
	value: string | number | boolean;
}

export interface ITiledFrame {
	tileid: number;
	duration: number;

	// pixi
	texture: Texture;
	time: number;
}

export interface ITiledTile {
	animation?: Array<ITiledFrame>;
	id: number;
	image?: string;
	imageheight: number;
	imagewidth: number;
	objectgroup: ITiledLayer;
	type?: number;
    properties: Array<IPropDefinition>;
	parsedProps: IParsedProps;
	
	// PIXI
	texture: Texture<any>;
	tilesetId?: number;
	lazyLoad?: boolean;
	fromSheet?: boolean;
}

export interface ITiledTileset {
	type: "tileset";
	name: string;
	firstgid: number;
	grid?: any;
	image: string;

	imageheight: number;
	imagewidth: number;
	margin?: number;
	spacing?: number;
	columns?: number;
	tilecount?: number;
	tileheight?: number;
	tilewidth?: number;
	tileoffset?: { x: number; y: number };
	tiles?: Array<ITiledTile>;
    properties: Array<IPropDefinition>;
    parsedProps: IParsedProps;
	source?: string;
}

export interface ITiledBaseObject {
	type: string;
	name: string;
	id: number;
	height: number;
	width: number;
	x: number;
	y: number;
	visible: boolean;
    properties: Array<IPropDefinition>;
    parsedProps: IParsedProps;
}

export interface ITiledText {
	text: string;
	wrap?: boolean; // false
	color?: string; // 0x0
	fontfamily?: string; // sans-serif
	pixelsize?: number; // 16
	kerning?: boolean; // true
	underline?: boolean; // false
	italic?: boolean; // false
	bold?: boolean; // false
	halign?: "center" | "right" | "justify" | "left"; // left;
	valign?: "center" | "bottom" | "top"; // top;
}

export interface ITiledObject extends ITiledBaseObject {
	gid: number;
	rotation: number;
	point?: boolean;
	ellipse?: boolean;
	polygon?: Array<{ x: number; y: number }>;
	polyline?: Array<{ x: number; y: number }>;
	text?: ITiledText;
}

export interface ITiledSprite extends ITiledObject {
	image?: ITiledTile;

	// pixi
	fromImageLayer?: boolean;
	vFlip: boolean;
	hFlip: boolean;
	anchor?: {x: number, y: number};
}

export interface ITiledLayer extends ITiledBaseObject {
	type: ILayerType;
	offsetx: number;
	offsety: number;
	opacity: number;
}

export interface ITiledTileLayer extends ITiledLayer {
	type: "tilelayer";
	data: Array<number>;
}

export interface ITiledObjectLayer extends ITiledLayer {
	type: "objectgroup";
	draworder: "topdown" | "index";
	objects: Array<ITiledObject>;
}

export interface ITiledImageLayer extends ITiledLayer {
	type: "imagelayer";
	image: string;
}

export interface ITiledGroupLayer extends ITiledLayer {
	type: "group";
	layers: Array<ITiledLayer>;
}

export interface ITiledMap {
	type: "map";

	height: number; // rows
	width: number; // collumns

	tileheight: number;
	tilewidth: number;

	backgroundcolor?: string;
	orientation: "orthogonal" | "isometric"; // only one supported now
    properties: Array<IPropDefinition>;
    parsedProps: IParsedProps;
	renderorder?: "right-down"; // right-down
	infinite?: boolean;

	tilesets: Array<ITiledTileset>;

	layers: Array<ITiledLayer>;
	nextobjectid: number;

	version: 1;
	tiledversion: string;
	baseUrl: string;
}
