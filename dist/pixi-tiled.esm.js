/* eslint-disable */
 
/*!
 * pixiv5-tiled - v2.0.0
 * Compiled Fri, 16 Jul 2021 11:53:40 UTC
 *
 * pixiv5-tiled is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2020, eXponenta <rondo.devil@gmail.com>, All Rights Reserved
 */
import { Container, DisplayObject } from '@pixi/display';
import { Point, Rectangle, Polygon, Ellipse, Matrix } from '@pixi/math';
import { Texture, ImageResource, BaseTexture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { AnimatedSprite } from '@pixi/sprite-animated';
import { Graphics } from '@pixi/graphics';
import { Text } from '@pixi/text';
import { Loader } from '@pixi/loaders';
import { EventEmitter } from '@pixi/utils';

class TiledContainer extends Container {constructor(...args) { super(...args); TiledContainer.prototype.__init.call(this);TiledContainer.prototype.__init2.call(this); }
	__init() {this.layerHeight = 0;}
	__init2() {this.layerWidth = 0;}
	
	
	
	
	
	
	
	
	
	
}

const Config = {
	defSpriteAnchor: new Point(0, 1),
	debugContainers: false,
	usePixiDisplay: false,
	roundFontAlpha: false,
	injectMiddleware: true,
	roundPixels: true
};

const LayerBuildersMap = {};

class TileAnimator {
	
	 __init() {this._childs = new Set();}
	

	constructor(tile) {TileAnimator.prototype.__init.call(this);

		if(!tile.animation) {
			throw new Error("Tile has not animation!");
		}

		this._tile = tile;
		this._animator = new AnimatedSprite( tile.animation);
		this._animator.onFrameChange = this.__onFrame.bind(this);
	}

	__onFrame() {
		this._childs.forEach((e)=> e.texture =  this._animator.texture);
	}

	get anim() {
		return this._animator;
	}

	add(s, strict = true) {
		if(!s) return;

		// prevent stack 
		if(this._childs.has(s)) return;
		
		s.anim = this;

		if(s.tileFrame !== this._tile && strict) {
			throw (`Invalid sprite! One Animator per tile type! Pased ${s.tileFrame.id} should be ${this._tile.id}`);
		}

		this._childs.add(s);
	}

	remove(s) {
		this._childs.delete(s);
	}
}

var TiledObjectType; (function (TiledObjectType) {
	const DEFAULT = 0; TiledObjectType[TiledObjectType["DEFAULT"] = DEFAULT] = "DEFAULT";
	const POINT = DEFAULT + 1; TiledObjectType[TiledObjectType["POINT"] = POINT] = "POINT";
	const POLYGON = POINT + 1; TiledObjectType[TiledObjectType["POLYGON"] = POLYGON] = "POLYGON";
	const POLYLINE = POLYGON + 1; TiledObjectType[TiledObjectType["POLYLINE"] = POLYLINE] = "POLYLINE";
	const ELLIPSE = POLYLINE + 1; TiledObjectType[TiledObjectType["ELLIPSE"] = ELLIPSE] = "ELLIPSE";
	const TEXT = ELLIPSE + 1; TiledObjectType[TiledObjectType["TEXT"] = TEXT] = "TEXT";
	const IMAGE = TEXT + 1; TiledObjectType[TiledObjectType["IMAGE"] = IMAGE] = "IMAGE";
})(TiledObjectType || (TiledObjectType = {}));

// https://doc.mapeditor.org/en/stable/reference/json-map-format/

function Objectype(meta) {
	if (meta.properties && meta.properties.container) return TiledObjectType.DEFAULT;
	if (meta.gid || meta.image) return TiledObjectType.IMAGE;
	if (meta.text != undefined) return TiledObjectType.TEXT;
	if (meta.point) return TiledObjectType.POINT;
	if (meta.polygon) return TiledObjectType.POLYGON;
	if (meta.polyline) return TiledObjectType.POLYLINE;
	if (meta.ellipse) return TiledObjectType.ELLIPSE;

	return TiledObjectType.DEFAULT;
}

class TiledRect extends Rectangle  {constructor(...args) { super(...args); TiledRect.prototype.__init.call(this);TiledRect.prototype.__init2.call(this);TiledRect.prototype.__init3.call(this); }
	__init() {this.name = "";}
	__init2() {this.types = [];}
	__init3() {this.visible = true;}
}

class TiledPoint extends Point  {
	__init4() {this.name = "";}
	__init5() {this.types = [];}
	__init6() {this.visible = true;}

	constructor(x, y) {
		super(x, y);TiledPoint.prototype.__init4.call(this);TiledPoint.prototype.__init5.call(this);TiledPoint.prototype.__init6.call(this);	}
}

class TiledPolygon extends Polygon  {
	__init7() {this.name = "";}
	__init8() {this.types = [];}
	__init9() {this.visible = true;}

	 __init10() {this._x = 0;}
	 __init11() {this._y = 0;}

	constructor(points) {
		super(points);TiledPolygon.prototype.__init7.call(this);TiledPolygon.prototype.__init8.call(this);TiledPolygon.prototype.__init9.call(this);TiledPolygon.prototype.__init10.call(this);TiledPolygon.prototype.__init11.call(this);	}

	set x(sX) {
		const delta = sX - this._x;
		this._x = sX;

		for (let xIndex = 0; xIndex < this.points.length; xIndex += 2) {
			this.points[xIndex] += delta;
		}
	}

	set y(sY) {
		const delta = sY - this._y;
		this._y = sY;

		for (let yIndex = 1; yIndex < this.points.length; yIndex += 2) {
			this.points[yIndex] += delta;
		}
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	getBounds() {
		let rect = new Rectangle();

		let maxX = this._x;
		let maxY = this._y;

		for (let index = 0; index < this.points.length; index += 2) {
			const px = this.points[index];
			const py = this.points[index + 1];

			rect.x = px < rect.x ? px : rect.x;
			rect.y = py < rect.y ? py : rect.y;

			maxX = px > maxX ? px : maxX;
			maxY = py > maxY ? py : maxY;
		}

		rect.width = maxX - rect.x;
		rect.height = maxY - rect.y;

		return rect;
	}

	get width() {
		return this.getBounds().width;
	}

	get height() {
		return this.getBounds().height;
	}

	set height(h) {
		const factor = h / this.height;

		for (let yIndex = 1; yIndex < this.points.length; yIndex += 2) {
			const delta = (this.points[yIndex] - this._y) * factor;
			this.points[yIndex] = this._y + delta;
		}
	}

	set width(w) {
		const factor = w / this.width;

		for (let xIndex = 0; xIndex < this.points.length; xIndex += 2) {
			const delta = (this.points[xIndex] - this._x) * factor;
			this.points[xIndex] = this._x + delta;
		}
	}
}

class TiledPolypine  {
	__init12() {this.name = "";}
	__init13() {this.types = [];}
	__init14() {this.visible = true;}

	__init15() {this.points = [];}

	constructor(points) {TiledPolypine.prototype.__init12.call(this);TiledPolypine.prototype.__init13.call(this);TiledPolypine.prototype.__init14.call(this);TiledPolypine.prototype.__init15.call(this);
		this.points = points.slice();
	}
}

class TiledEllipse extends Ellipse  {
	__init16() {this.name = "";}
	__init17() {this.types = [];}
	__init18() {this.visible = true;}

	constructor(x, y, hw, hh) {
		super(x, y, hw, hh);TiledEllipse.prototype.__init16.call(this);TiledEllipse.prototype.__init17.call(this);TiledEllipse.prototype.__init18.call(this);	}
}

function BuildPrimitive( meta ) {
	
	if (!meta) {
		return;
	}

	let prim = undefined;

	const type = Objectype(meta);

	meta.x = meta.x || 0;
	meta.y = meta.y || 0;

	switch (type) {
		case TiledObjectType.ELLIPSE: {
			prim = new TiledEllipse(
				meta.x + 0.5 * meta.width,
				meta.y + 0.5 * meta.height,
				meta.width * 0.5,
				meta.height * 0.5
			);
			break;
		}
		case TiledObjectType.POLYGON: {
			const points = meta.polygon;
			const poses = points.map(p => {
				return new Point(p.x + meta.x, p.y + meta.y);
			});
			
			prim = new TiledPolygon(poses);
			break;
		}
		case TiledObjectType.POLYLINE: {
			const points = meta.polygon;
			const poses = points.map(p => {
				return new Point(p.x + meta.x, p.y + meta.y);
			});

			prim = new TiledPolypine(poses);
			break;
		}
		default:
			prim = new TiledRect(meta.x, meta.y, meta.width, meta.height);
	}

	prim.types = meta.type ? meta.type.split(":") : [];
	prim.visible = meta.visible;
	prim.name = meta.name;
	
	return prim;
}

var TiledPrimitives = /*#__PURE__*/Object.freeze({
	__proto__: null,
	TiledRect: TiledRect,
	TiledPoint: TiledPoint,
	TiledPolygon: TiledPolygon,
	TiledPolypine: TiledPolypine,
	TiledEllipse: TiledEllipse,
	BuildPrimitive: BuildPrimitive
});

function HexStringToHexInt(value) {
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

function resolveTile(tilesets, gid) {
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
		find = tileSet.tiles.filter(obj => obj.id == realGid)[0];
	}
	if (find === undefined)
	{
		find = {id: realGid} ; 
	}

	let img = Object.assign({}, find, { tilesetId });

	if (!img) {
		console.error('Load res MISSED gid:' + realGid);
		return null;
	}

	return img;
}

function _prepareProperties(layer) {
	let props = {};

	if (layer.properties) {
		if (layer.properties instanceof Array) {
			for (var p of layer.properties) {
				let val = p.value;
				if (p.type == 'color') {
					val = HexStringToHexInt(val );
				}
				props[p.name] = val;
			}
		} else {
			// old tiled format
			props = layer.properties;
		}
	}

	const spriteObject = layer ;

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

function ApplyMeta(meta, target) {
	target.name = meta.name;
	target.tiledId = meta.id;
	target.width = meta.width || target.width;
	target.height = meta.height || target.height;
	target.rotation = (((meta ).rotation || 0) * Math.PI) / 180.0;

	target.x = meta.x || 0;
	target.y = meta.y || 0;

	target.visible = meta.visible == undefined ? true : meta.visible;
	target.types = meta.type ? meta.type.split(":") : [];

	target.primitive = BuildPrimitive(meta );

	const props = meta.parsedProps;

	if (props) {
		if (!isNaN(props.opacity )) {
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

			target.parent.addChild(rect);
		}, 30);
	}
}

class TiledSprite extends Sprite {
	
	
	 __init() {this.primitives = [];}
	 __init2() {this.properties = {};}
	
	

	constructor(source, createAnimator = false, autoInit = true) {
		super(source.image.texture);TiledSprite.prototype.__init.call(this);TiledSprite.prototype.__init2.call(this);
		this.source = source;
		this.tileFrame = source.image;

		if (createAnimator && this.tileFrame.animation) {
			this.anim = new TileAnimator(this.tileFrame);
		}

		if(autoInit) {
			this.init();
		}
	}

	init() {
		ApplyMeta(this.source, this );

		if (this.anim) {
			const a = this.anim.anim;

			this.properties.animPlaying && a.play();
			a.loop = this.properties.animLoop !== undefined ? !!this.properties.animLoop : true;
		}

		//TODO Set anchor and offsets to center (.5, .5)
		if (this.source.gid) {
			this.anchor.copyFrom( (this.source.anchor ||  Config.defSpriteAnchor) );
		}

		const obj = this.tileFrame.objectgroup ;

		if (obj) {
			this.primitives = obj.objects.map(e => BuildPrimitive(e));
		}

		const hFlip = this.source.hFlip;
		const vFlip = this.source.vFlip;

		if (hFlip) {
			this.scale.x *= -1;
			this.anchor.x = 1;
		}

		if (vFlip) {
			this.scale.y *= -1;
			this.anchor.y = 0;
		}
	}

	set anim(anim) {
		if (anim === this._animator) return;

		if (this._animator) {
			this._animator.remove(this);
		}
		this._animator = anim;

		anim && anim.add(this);
	}

	get anim() {
		return this._animator;
	}

	clone() {
		const sprite = new TiledSprite(this.source, true);
		sprite.init();

		return sprite;
	}
}

function Build$2(meta) {
	const types = meta.type ? meta.type.split(":") : [];

	let container = undefined; // new TiledOG.TiledContainer();

	if (types.indexOf("mask") > -1) {
		const source = {
			image: {
				texture: Texture.WHITE,
				id: - 1,
			},
			fromImageLayer: true
		}; 
		container = new TiledSprite(source);
	} else {
		container = new TiledContainer();
		ApplyMeta(meta, container );
	}

	if (meta.gid) {
		container.pivot = Config.defSpriteAnchor ;
		( container).hitArea = new Rectangle(0, 0, meta.width, meta.height);
	}

	return container;
}

var ContainerBuilder = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Build: Build$2
});

function Build$1(meta) {
	// legacy
	const sprite = new TiledSprite(meta, true);

	return sprite;
}

var SpriteBuilder = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Build: Build$1
});

function Build(meta) {
	const container = new TiledContainer();
	const text = meta.text;

	let pixiText = new Text(text.text, {
		wordWrap: text.wrap,
		wordWrapWidth: meta.width,
		fill: HexStringToHexInt(text.color || "#000000") || 0x000000,
		align: text.valign || "top",
		fontFamily: text.fontfamily || "sans-serif",
		fontWeight: text.bold ? "bold" : "normal",
		fontStyle: text.italic ? "italic" : "normal",
		fontSize: text.pixelsize || "16px"
	} );

	//@ts-ignore
	pixiText.name = meta.name + "_Text";

	pixiText.roundPixels = !!Config.roundFontAlpha;

	const props = meta.parsedProps;

	// clear properties
	meta.properties = [];
	meta.parsedProps = {};

	ApplyMeta(meta, container);
	container.pivot.set(0, 0);

	switch (text.halign) {
		case "right":
			{
				pixiText.anchor.x = 1;
				pixiText.position.x = meta.width;
			}
			break;
		case "center":
			{
				pixiText.anchor.x = 0.5;
				pixiText.position.x = meta.width * 0.5;
			}
			break;
		default:
			{
				pixiText.anchor.x = 0;
				pixiText.position.x = 0;
			}
			break;
	}

	switch (text.valign) {
		case "bottom":
			{
				pixiText.anchor.y = 1;
				pixiText.position.y = meta.height;
			}
			break;
		case "center":
			{
				pixiText.anchor.y = 0.5;
				pixiText.position.y = meta.height * 0.5;
			}
			break;
		default:
			{
				pixiText.anchor.y = 0;
				pixiText.position.y = 0;
			}
			break;
	}

	if (props) {
		pixiText.style.stroke =
			HexStringToHexInt(props.strokeColor ) || 0;

		pixiText.style.strokeThickness = +props.strokeThickness || 0;
		pixiText.style.padding = +props.fontPadding || 0;

		Object.assign(pixiText, props);
	}

	//_cont.parentGroup = _layer.group;
	container.addChild( pixiText);

	//@ts-ignore
	container.text = pixiText;

	container.properties = props;

	return container;
}

var TextBuilder = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Build: Build
});

class MultiSpritesheet {
	__init() {this.sheets = [];}
	__init2() {this.images = {};}

	constructor(sheets) {MultiSpritesheet.prototype.__init.call(this);MultiSpritesheet.prototype.__init2.call(this);
		if (sheets) {
			sheets.forEach(element => {
				this.add(element);
			});
		}
	}

	add(sheet) {
		if (!sheet) throw "Sheet can't be undefined";
		if (sheet === this) throw "U can't add self to spritesheet";

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
			// can be looped
			Object.assign(map, spr.animations);
		}

		return map;
	}
}

class TilesetManager extends EventEmitter {
	 __init() {this._sheet = new MultiSpritesheet();}
	 __init2() {this._loadQueue = 0;}

	/**
	 * @description Base url for all images
	 */
	 __init3() {this.baseUrl = '';}

	/**
	 * @description Preload images which not exist in spritesheet
	 */
	 __init4() {this.loadUnknowImages = true;}

	constructor( _tileSets, sheet) {
		super();this._tileSets = _tileSets;TilesetManager.prototype.__init.call(this);TilesetManager.prototype.__init2.call(this);TilesetManager.prototype.__init3.call(this);TilesetManager.prototype.__init4.call(this);
		if (sheet) {
			if (sheet.textures) {
				this.register(sheet );
			} else {
				Object.keys(sheet).forEach(e => {
					this._sheet.addTexture((sheet )[e], e);
				});
			}
		}
	}

	register(spritesheet) {
		this._sheet.add(spritesheet);
	}

	get spritesheet() {
		return this._sheet;
	}

	getTileByGid(gid, tryLoad = this.loadUnknowImages) {
		const tile = resolveTile(this._tileSets, gid);
		return this.getTileByTile(tile, tryLoad);
	}

	getTileByTile(tile, tryLoad = this.loadUnknowImages, skipAnim = false) {
		if (!tile) {
			return undefined;
		}
		const set = this._tileSets[tile.tilesetId];

		if(!tile.image && set.image) {
			tile.fromSheet = true;
			tile.image = set.image;
		}

		if(!tile.image) {
			return undefined;
		}
		if (tile.animation && !skipAnim) {
			tile.animation.forEach(e => {
				const atile = set.tiles.filter(obj => obj.id == e.tileid)[0];
				atile.tilesetId = tile.tilesetId;
				e.texture = this.getTileByTile(atile, tryLoad, true).texture;
				e.time = e.duration;
			});
		}

		let texture = this.spritesheet.textures[tile.image];

		tile.lazyLoad = false;

		const absUrl = this._relativeToAbsolutePath(this.baseUrl, tile.image);

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

	getTileSetByGid(gid) {
		const frame = resolveTile(this._tileSets, gid);
		
		if(!frame) {
			return undefined;
		}

		return this._tileSets[frame.tilesetId];
	}

	_relativeToAbsolutePath(base, relative) {
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

	_cropTile(set, tile, texture) {
		
		const colls = set.columns;
		set.tilecount / colls;
		const margin = set.margin || 0;
		const space = set.spacing || 0;
		const xId = tile.id % colls;
		const yId = tile.id / colls | 0;

		texture = new Texture(texture.baseTexture, new Rectangle(
			margin + xId * (set.tilewidth + space),
			margin + yId * (set.tileheight + space),
			set.tileheight, set.tilewidth
		));

		this._sheet.addTexture(texture, `${tile.image}_${tile.tilesetId}:${tile.id}`);

		return texture;
	}

	_tryLoadTexture(url, tile) {
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
			.catch((e)=>{
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

class TiledMapContainer extends TiledContainer {
	
}

//inject new field in resources







let showHello = true;

function CreateStage(
	sheet,
	_data,
	baseUrl = '',
) {

	if (showHello) {
		console.log('[TILED] Importer!\neXponenta {rondo.devil[a]gmail.com}');
		showHello = false;
	}
	const stage = new TiledMapContainer();

	stage.layerHeight = _data.height;
	stage.layerWidth = _data.width;
	stage.source = _data;

	stage.tileSet = new TilesetManager(_data.tilesets, sheet);
	stage.tileSet.baseUrl = baseUrl;

	if (_data.layers) {
		let zOrder = 0; //_data.layers.length;

		for (let layer of _data.layers) {
			const builder = LayerBuildersMap[layer.type];

			if (!builder) {
				console.warn(`[TILED] Importer can't support ${layer.type} layer type!`);
				continue;
			}

			const pixiLayer = builder.Build(layer, stage.tileSet, zOrder, stage);

			if (!pixiLayer) {
				continue;
			}

			zOrder++;
			stage.layers = {
				[layer.name]: pixiLayer,
			};

			stage.addChild(pixiLayer);
		}
	}

	return stage;
}

const Parser = {
	Parse(res, next) {
		const data = res.data;
		//validate
		if (!data || data.type != 'map') {
			next();
			return;
		}

		const cropName = new RegExp(/^.*[\\\/]/);
		let baseUrl = res.url.replace((this ).baseUrl, '');
		baseUrl = baseUrl.match(cropName)[0];

		const tilesetsToLoad = [];
		for (let  tilesetIndex = 0; tilesetIndex < data.tilesets.length; tilesetIndex++)
		{
			const tileset = data.tilesets[tilesetIndex];
			if (tileset.source !== undefined)
			{
				tilesetsToLoad.push(tileset);
			}
		}

		const _tryCreateStage = function()
		{
			const stage = CreateStage(res.textures, data, baseUrl);

			if (!stage) {
				next();
				return;
			}

			stage.name = res.url.replace(cropName, '').split('.')[0];
			//@ts-ignore
			res.stage = stage;

			if (stage.tileSet.loaded) {
				next();
				return;
			}

			stage.tileSet.once('loaded', () => next());
		};

		if (tilesetsToLoad.length > 0)
		{
			const loader = new Loader();
			for (let tilesetIndex = 0; tilesetIndex < tilesetsToLoad.length; tilesetIndex++)
			{
				loader.add(baseUrl + tilesetsToLoad[tilesetIndex].source);
			}
			loader.load(()=>{
				Object.keys(loader.resources).forEach(resourcePath => {
					let tilesetResource = loader.resources[resourcePath];
					let resourceFileName =  resourcePath.replace(cropName, '');
					for (let  tilesetIndex = 0; tilesetIndex < data.tilesets.length; tilesetIndex++)
					{
						const tileset = data.tilesets[tilesetIndex];
						if (tileset.source === resourceFileName)
						{
							Object.assign(tileset, tilesetResource.data);
						}
					}
				});
				_tryCreateStage();
			});
		}
		else
		{
			_tryCreateStage();
		}
	},

	use(res, next) {
		Parser.Parse.call(this, res, next);
	},

	add() {
		console.log('[TILED] middleware registered!');
	},
};

function container (container) {

	if (!container)
		throw new Error("Cant't find Container in package!");

	/**
	 * @mixes
	 * MIXIN FROM pixiv5-tiled
	 * Get child by path
	 */

	Object.assign(container.prototype,
		{
			getChildByPath: function (path) {
				const _this =  this;
				
				if (!_this.children || _this.children.length == 0)
					return undefined;

				let result = _this;

				const split = path.split("/");
				const isIndex = new RegExp("(?:{{0})-?d+(?=})");

				for (const p of split) {
					//@ts-ignore
					if (result == undefined || !(result.children)) {
						result = undefined;
						break;
					}

					if (p.trim().length == 0) continue;

					// find by index
					//@ts-ignore
					const ch = result.children;
					const mathes = p.match(isIndex);
					if (mathes) {
						let index = parseInt(mathes[0]);
						if (index < 0) {
							index += ch.length;
						}
						if (index >= ch.length) {
							result = undefined;
						} else {
							result = ch[index];
						}
						continue;
					}

					//default by name
					result = (result ).getChildByName(p);
				}

				return result ;
			},

			addGlobalChild: function (...child) {
				const _this =  this;
				//TODO: better to convert global position to current matrix
				_this.transform.updateLocalTransform();
				
				const loc = new Matrix();
				const invert = _this.transform.localTransform.clone().invert();
				
				for (let i = 0; i < child.length; i++) {

					const newChild = child[i];
					newChild.transform.updateLocalTransform();
					loc.copyFrom(invert);
					loc.append(newChild.localTransform);
					child[i].transform.setFromMatrix(loc);
				}

				return _this.addChild(...child);

			}
		});
}

function display(displayObject) {

	if(!displayObject)
		throw new Error("Cant't find DisplayObject in package!");
	
	(displayObject.prototype).replaceWithTransform = function(from) {
        from.updateTransform();

        if(from.parent){
			from.parent.addChildAt(this, from.parent.getChildIndex(from));
		}

		this.pivot.copyFrom(from.pivot);        
        this.position.copyFrom(from.position);
		this.scale.copyFrom(from.scale);
		this.rotation = from.rotation;

        this.updateTransform();
    };
}

function emitter(eventEmitter) {
	if(!eventEmitter)
		throw new Error("Cant't find utils in package!");

    ( eventEmitter.prototype).onceAsync = function(event, context)  {
        return new Promise((res)=>{
            this.once(event, res, context);
        })
    };
}

function InjectMixins(pixiPackage) {
    if (pixiPackage) {
        console.log('Deprication. Mixins attached automatically');
    }

    container(Container);
    display(DisplayObject);
    emitter(EventEmitter);
}

const LayerBuilder = {
	Build(layer, tileset, zOrder = 0) {
		_prepareProperties(layer);

		const props = layer.parsedProps;

		if (props.ignore || props.ignoreLoad) {
			console.log('[TILED] layer ignored:' + layer.name);
			return undefined;
		}

		const layerObject = new TiledContainer();

		layerObject.tiledId = layer.id;
		layerObject.name = layer.name;
		layerObject.visible = layer.visible;

		layerObject.position.set(layer.x, layer.y);
		layerObject.alpha = layer.opacity || 1;

		ApplyMeta(layer, layerObject);
		return layerObject;
	},
};

const ObjectLayerBuilder = {
	__gen: {
		[TiledObjectType.IMAGE](meta, tileset) {
			const smeta = meta ;
			const frame = smeta.image ? tileset.getTileByTile(smeta.image) : tileset.getTileByGid(smeta.gid);

			smeta.image = frame;

			const sprite = Build$1(smeta) ;

			if (smeta.fromImageLayer && frame.lazyLoad) {
				frame.texture.once('loaded', () => {
					sprite.scale.set(1);
				});
			}

			if (smeta.fromImageLayer) {
				sprite.anchor.set(0);
			}

			return (sprite ) ;
		},
		[TiledObjectType.TEXT](meta, tileset) {
			return Build(meta);
		},
		[TiledObjectType.DEFAULT](meta, tileset) {
			return Build$2(meta);
		},
	},

	Build(layer, tileset, zOrder = 0) {
		const objLayer = layer ;
		const layerContatiner = LayerBuilder.Build(layer, tileset, zOrder);

		if (!layerContatiner) {
			return undefined;
		}

		if (layer.type === 'imagelayer') {
			if (!this.__convertLayer(layer )) {
				return undefined;
			}
		}

		if (!objLayer.objects || !objLayer.objects.length) {
			return layerContatiner;
		}

		const objects = objLayer.objects;

		let localZIndex = 0;

		for (let objMeta of objects) {
			_prepareProperties(objMeta);

			const type = Objectype(objMeta);
			const method = this.__gen[type] || this.__gen[TiledObjectType.DEFAULT];
			const obj = method.call(this, objMeta, tileset);

			if (!obj) {
				continue;
			}

			/*
			if (Config.usePixiDisplay) {
				(obj as any).parentGroup = (layerContatiner as any).group;
				stage.addChildAt(pixiObject, localZIndex);
			} else {
				*/

			layerContatiner.addChildAt(obj, localZIndex);
			//}

			localZIndex++;
		}

		return layerContatiner;
	},

	__convertLayer(imageLayer) {
		if (!imageLayer.image) {
			return false;
		}

		(imageLayer ).objects = [
			{
				image: {
					image: imageLayer.image,
				},
				//imageLayer can't has gid ID

				gid: -1,
				name: imageLayer.name,
				x: imageLayer.x + imageLayer.offsetx,
				y: imageLayer.y + imageLayer.offsety,

				fromImageLayer: true,
				properties: imageLayer.properties,
				parsedProps: imageLayer.parsedProps,
			} ,
		];

		return true;
	},
};

const TiledLayerBuilder = {
	Build(layer, set, zOrder = 0, tileMap) {
		const tiledLayer = layer ;
		const tileMapSource = tileMap.source ;
		const layerContatiner = LayerBuilder.Build(layer, set, zOrder) ;

		if(!layerContatiner) {
			return undefined;
		}

		const data = this.__decodeData(tiledLayer);
		const { width, height } = layer;
		const { tileheight, tilewidth } = tileMapSource;

		const genTile = (x, y, gid)=>{
			const tile = set.getTileByGid(gid);

			const s = new TiledSprite({
				image: tile,
				fromImageLayer: false,
				gid: gid,
				anchor: {x: 0, y: 0}
			} );
			
			s.x = x * tilewidth;
			s.y = y * tileheight - (tile.imageheight === undefined ? 0 : tile.imageheight - tileheight);
			s.roundPixels = Config.roundPixels;

			if(tile && tile.animation) {
				const animators = layerContatiner.animators || new Map();
				const animId = tile.tilesetId + "_" + tile.id;

				let animator = animators.get(animId);
				if(!animator) {
					animator = new TileAnimator(tile);
					animators.set(animId, animator);
				}

				s.anim = animator;
				animator.anim.play();
			}

			return s;
		};

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const index = x + y * width;
				const gid = data[index];

				// skip gid 0,
				if(!gid) {
					continue;
				}

				layerContatiner.addChild(genTile(x,y,data[index]));
			}
		}

		return layerContatiner;
	},

	__decodeData(layer) {
		return layer.data;
	},
};

const VERSION = '2.0.0';

// prevent circular
Object.assign(LayerBuildersMap, {
	tilelayer: TiledLayerBuilder,
	objectgroup: ObjectLayerBuilder,
	imagelayer: ObjectLayerBuilder,
	group: undefined,
});

function Inject(pixiPack = window.PIXI, props = undefined) {
	if (!pixiPack) {
		console.warn(
			"Auto injection works only with globals scoped PIXI, not in modules\nuse 'Loader.registerPlugin(Parser)' otherwith",
		);
		return;
	}

	if (props) {
		Object.assign(Config, props);
	}

	InjectMixins(pixiPack);

	if (Config.injectMiddleware) {
		pixiPack.Loader.registerPlugin(Parser);
	}
}

export { Config, ContainerBuilder, CreateStage, Inject, MultiSpritesheet, Parser, TiledPrimitives as Primitives, SpriteBuilder, TextBuilder, TiledContainer, VERSION };
//# sourceMappingURL=pixi-tiled.esm.js.map
