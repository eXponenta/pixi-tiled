/*
	PIXI v5 Tiled support lib, version 1.1.11
	Author: eXponenta <rondo.devil@gmail.com> 
*/
var TiledOG = (function (exports, PIXI$1) {
	'use strict';

	class TiledContainer extends PIXI$1.Container {
	    constructor() {
	        super(...arguments);
	        this.layerHeight = 0;
	        this.layerWidth = 0;
	    }
	}

	function HexStringToHexInt(value) {
	    if (!value)
	        return 0;
	    if (typeof value == "number")
	        return value;
	    value = value.length > 7 ? value.substr(3, 6) : value.substr(1, 6);
	    try {
	        return parseInt(value, 16);
	    }
	    catch (e) {
	        console.warn("Color parse error:", e.message);
	        return 0;
	    }
	}
	var TiledObjectType;
	(function (TiledObjectType) {
	    TiledObjectType[TiledObjectType["DEFAULT"] = 0] = "DEFAULT";
	    TiledObjectType[TiledObjectType["POINT"] = 1] = "POINT";
	    TiledObjectType[TiledObjectType["POLYGON"] = 2] = "POLYGON";
	    TiledObjectType[TiledObjectType["POLYLINE"] = 3] = "POLYLINE";
	    TiledObjectType[TiledObjectType["ELLIPSE"] = 4] = "ELLIPSE";
	    TiledObjectType[TiledObjectType["TEXT"] = 5] = "TEXT";
	    TiledObjectType[TiledObjectType["IMAGE"] = 6] = "IMAGE";
	})(TiledObjectType || (TiledObjectType = {}));
	function Objectype(meta) {
	    if (meta.properties && meta.properties.container)
	        return TiledObjectType.DEFAULT;
	    if (meta.gid || meta.image)
	        return TiledObjectType.IMAGE;
	    if (meta.text != undefined)
	        return TiledObjectType.TEXT;
	    if (meta.point)
	        return TiledObjectType.POINT;
	    if (meta.polygon)
	        return TiledObjectType.POLYGON;
	    if (meta.polyline)
	        return TiledObjectType.POLYLINE;
	    if (meta.ellipse)
	        return TiledObjectType.ELLIPSE;
	    return TiledObjectType.DEFAULT;
	}
	function resolveImageUrl(tilesets, baseUrl, gid) {
	    let tileSet = undefined;
	    let tilesetId = 0;
	    for (let i = 0; i < tilesets.length; i++) {
	        if (tilesets[i].firstgid <= gid) {
	            tileSet = tilesets[i];
	            tilesetId = i;
	            break;
	        }
	    }
	    if (!tileSet) {
	        console.error("Image with gid:" + gid + " not found!");
	        return null;
	    }
	    const realGid = gid - tileSet.firstgid;
	    let find = tileSet.tiles.filter(obj => obj.id == realGid)[0];
	    let img = Object.assign({}, find, { tilesetId });
	    if (!img) {
	        console.error("Load res MISSED gid:" + realGid);
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
	                if (p.type == "color") {
	                    val = HexStringToHexInt(val);
	                }
	                props[p.name] = val;
	            }
	        }
	        else {
	            props = layer.properties;
	        }
	    }
	    const spriteObject = layer;
	    if (spriteObject.gid > 0) {
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

	class TiledRect extends PIXI$1.Rectangle {
	    constructor() {
	        super(...arguments);
	        this.name = "";
	        this.types = [];
	        this.visible = true;
	    }
	}
	class TiledPoint extends PIXI$1.Point {
	    constructor(x, y) {
	        super(x, y);
	        this.name = "";
	        this.types = [];
	        this.visible = true;
	    }
	}
	class TiledPolygon extends PIXI$1.Polygon {
	    constructor(points) {
	        super(points);
	        this.name = "";
	        this.types = [];
	        this.visible = true;
	        this._x = 0;
	        this._y = 0;
	    }
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
	        let rect = new PIXI$1.Rectangle();
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
	class TiledPolypine {
	    constructor(points) {
	        this.name = "";
	        this.types = [];
	        this.visible = true;
	        this.points = [];
	        this.points = points.slice();
	    }
	}
	class TiledEllipse extends PIXI$1.Ellipse {
	    constructor(x, y, hw, hh) {
	        super(x, y, hw, hh);
	        this.name = "";
	        this.types = [];
	        this.visible = true;
	    }
	}
	function BuildPrimitive(meta) {
	    if (!meta) {
	        return;
	    }
	    let prim = undefined;
	    const type = Objectype(meta);
	    meta.x = meta.x || 0;
	    meta.y = meta.y || 0;
	    switch (type) {
	        case TiledObjectType.ELLIPSE: {
	            prim = new TiledEllipse(meta.x + 0.5 * meta.width, meta.y + 0.5 * meta.height, meta.width * 0.5, meta.height * 0.5);
	            break;
	        }
	        case TiledObjectType.POLYGON: {
	            const points = meta.polygon;
	            const poses = points.map(p => {
	                return new PIXI$1.Point(p.x + meta.x, p.y + meta.y);
	            });
	            prim = new TiledPolygon(poses);
	            break;
	        }
	        case TiledObjectType.POLYLINE: {
	            const points = meta.polygon;
	            const poses = points.map(p => {
	                return new PIXI$1.Point(p.x + meta.x, p.y + meta.y);
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

	function Build(meta) {
	    let sprite;
	    if (meta.image.animation) {
	        sprite = new PIXI$1.AnimatedSprite(meta.image.animation, !!meta.parsedProps.autoUpdate || true);
	        const a = sprite;
	        a.play && (meta.parsedProps.animPlaying) && a.play();
	        a.loop = meta.parsedProps.animLoop !== undefined ? meta.parsedProps.animLoop : true;
	    }
	    else {
	        sprite = new PIXI$1.Sprite(meta.image.texture || PIXI$1.Texture.EMPTY);
	    }
	    if (!meta.fromImageLayer) {
	        sprite.anchor = Config.defSpriteAnchor;
	    }
	    ApplyMeta(meta, sprite);
	    const obj = meta.image.objectgroup;
	    if (obj) {
	        sprite.primitive = BuildPrimitive(obj.objects[0]);
	    }
	    const hFlip = meta.hFlip;
	    const vFlip = meta.vFlip;
	    if (hFlip) {
	        sprite.scale.x *= -1;
	        sprite.anchor.x = 1;
	    }
	    if (vFlip) {
	        sprite.scale.y *= -1;
	        sprite.anchor.y = 0;
	    }
	    return sprite;
	}

	var SpriteBuilder = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Build: Build
	});

	function Build$1(meta) {
	    const container = new TiledContainer();
	    const text = meta.text;
	    let pixiText = new PIXI$1.Text(text.text, {
	        wordWrap: text.wrap,
	        wordWrapWidth: meta.width,
	        fill: HexStringToHexInt(text.color || "#000000") || 0x000000,
	        align: text.valign || "top",
	        fontFamily: text.fontfamily || "sans-serif",
	        fontWeight: text.bold ? "bold" : "normal",
	        fontStyle: text.italic ? "italic" : "normal",
	        fontSize: text.pixelsize || "16px"
	    });
	    pixiText.name = meta.name + "_Text";
	    pixiText.roundPixels = !!Config.roundFontAlpha;
	    const props = meta.parsedProps;
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
	            HexStringToHexInt(props.strokeColor) || 0;
	        pixiText.style.strokeThickness = props.strokeThickness || 0;
	        pixiText.style.padding = props.fontPadding || 0;
	        Object.assign(pixiText, props);
	    }
	    container.addChild(pixiText);
	    container.text = pixiText;
	    container.properties = props;
	    return container;
	}

	var TextBuilder = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Build: Build$1
	});

	class MultiSpritesheet {
	    constructor(sheets) {
	        this.sheets = [];
	        this.images = {};
	        if (sheets) {
	            sheets.forEach(element => {
	                this.add(element);
	            });
	        }
	    }
	    add(sheet) {
	        if (!sheet)
	            throw "Sheet can't be undefined";
	        if (sheet === this)
	            throw "U can't add self to spritesheet";
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
	            Object.assign(map, spr.animations);
	        }
	        return map;
	    }
	}

	class TilesetManager {
	    constructor(_tileSets, sheet) {
	        this._tileSets = _tileSets;
	        this._sheet = new MultiSpritesheet();
	        this.baseUrl = '';
	        this.loadUnknowImages = true;
	        if (sheet) {
	            this.register(sheet);
	        }
	    }
	    register(spritesheet) {
	        this._sheet.add(spritesheet);
	    }
	    get spritesheet() {
	        return this._sheet;
	    }
	    getTileByGid(gid, tryLoad = this.loadUnknowImages) {
	        const tile = resolveImageUrl(this._tileSets, this.baseUrl, gid);
	        return this.getTileByTile(tile, tryLoad);
	    }
	    getTileByTile(tile, tryLoad = this.loadUnknowImages, skipAnim = false) {
	        if (!tile || !tile.image) {
	            return undefined;
	        }
	        if (tile.animation && !skipAnim) {
	            const ts = this._tileSets[tile.tilesetId];
	            tile.animation.forEach((e) => {
	                e.texture = this.getTileByTile(ts.tiles[e.tileid], tryLoad, true).texture;
	                e.time = e.duration;
	            });
	        }
	        const absUrl = this.baseUrl + tile.image;
	        let texture = this.spritesheet.textures[tile.image];
	        if (!texture && tryLoad) {
	            texture = PIXI$1.Texture.from(absUrl, {}, false);
	            this._sheet.addTexture(texture, tile.image);
	        }
	        tile.texture = texture;
	        return tile;
	    }
	}

	let showHello = true;
	function CreateStage(res, loader) {
	    let _data;
	    if (res instanceof PIXI$1.LoaderResource) {
	        _data = res.data;
	    }
	    else {
	        _data = loader;
	    }
	    if (!_data || _data.type != 'map') {
	        return undefined;
	    }
	    if (showHello) {
	        console.log('[TILED] Importer!\neXponenta {rondo.devil[a]gmail.com}');
	        showHello = false;
	    }
	    const useDisplay = !!Config.usePixiDisplay && PIXI.display !== undefined;
	    const sheet = res.textures ? res : undefined;
	    const stage = new TiledContainer();
	    const cropName = new RegExp(/^.*[\\\/]/);
	    stage.layerHeight = _data.height;
	    stage.layerWidth = _data.width;
	    stage.source = _data;
	    let baseUrl = '';
	    if (res instanceof PIXI$1.LoaderResource) {
	        stage.name = res.url.replace(cropName, '').split('.')[0];
	        baseUrl = res.url.replace(loader.baseUrl, '');
	        baseUrl = baseUrl.match(cropName)[0];
	    }
	    if (_data.layers) {
	        const setManager = new TilesetManager(_data.tilesets, sheet);
	        setManager.baseUrl = baseUrl;
	        let zOrder = 0;
	        if (useDisplay) {
	            _data.layers = _data.layers.reverse();
	        }
	        for (let layer of _data.layers) {
	            const builder = LayerBuildersMap[layer.type];
	            if (!builder) {
	                console.warn(`[TILED] Importer can't support ${layer.type} layer type!`);
	                continue;
	            }
	            const pixiLayer = builder.Build(layer, setManager, zOrder);
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
	        var stage = CreateStage(res, this);
	        res.stage = stage;
	        next();
	    },
	    use(res, next) {
	        Parser.Parse.call(this, res, next);
	    },
	    add() {
	        console.log('[TILED] middleware registered!');
	    },
	};

	function container (pack) {
	    if (!pack.Container)
	        throw new Error("Cant't find Container in package!");
	    PIXI$1.Container.prototype.getChildByPath = function (path) {
	        if (!this.children || this.children.length == 0)
	            return undefined;
	        let result = this;
	        const split = path.split("/");
	        const isIndex = new RegExp("(?:{{0})-?d+(?=})");
	        for (const p of split) {
	            if (result == undefined || !(result.children)) {
	                result = undefined;
	                break;
	            }
	            if (p.trim().length == 0)
	                continue;
	            const ch = result.children;
	            const mathes = p.match(isIndex);
	            if (mathes) {
	                let index = parseInt(mathes[0]);
	                if (index < 0) {
	                    index += ch.length;
	                }
	                if (index >= ch.length) {
	                    result = undefined;
	                }
	                else {
	                    result = ch[index];
	                }
	                continue;
	            }
	            result = result.getChildByName(p);
	        }
	        return result;
	    };
	    PIXI$1.Container.prototype.addGlobalChild = function (...child) {
	        this.transform.updateLocalTransform();
	        const loc = new PIXI$1.Matrix();
	        const invert = this.transform.localTransform.clone().invert();
	        for (let i = 0; i < child.length; i++) {
	            const newChild = child[i];
	            newChild.transform.updateLocalTransform();
	            loc.copyFrom(invert);
	            loc.append(newChild.localTransform);
	            child[i].transform.setFromMatrix(loc);
	        }
	        return this.addChild(...child);
	    };
	}

	function display (pack) {
	    if (!pack.DisplayObject)
	        throw new Error("Cant't find DisplayObject in package!");
	    pack.DisplayObject.prototype.replaceWithTransform = function (from) {
	        from.updateTransform();
	        if (from.parent) {
	            from.parent.addChildAt(this, from.parent.getChildIndex(from));
	        }
	        this.pivot.copyFrom(from.pivot);
	        this.position.copyFrom(from.position);
	        this.scale.copyFrom(from.scale);
	        this.rotation = from.rotation;
	        this.updateTransform();
	    };
	}

	function emitter (pack) {
	    if (!pack.utils)
	        throw new Error("Cant't find utils in package!");
	    pack.utils.EventEmitter.prototype.onceAsync = function (event, context) {
	        return new Promise((res) => {
	            this.once(event, res, context);
	        });
	    };
	}

	function InjectMixins(pixiPackage) {
	    container(pixiPackage);
	    display(pixiPackage);
	    emitter(pixiPackage);
	}

	const LayerBuilder = {
	    Build(layer, tileset, zOrder = 0) {
	        const useDisplay = !!Config.usePixiDisplay && PIXI.display !== undefined;
	        const Layer = useDisplay ? PIXI.display.Layer : {};
	        const Group = useDisplay ? PIXI.display.Group : {};
	        _prepareProperties(layer);
	        const props = layer.parsedProps;
	        if (props.ignore || props.ignoreLoad) {
	            console.log('[TILED] layer ignored:' + layer.name);
	            return undefined;
	        }
	        const layerObject = useDisplay
	            ? new Layer(new Group(props.zOrder !== undefined ? props.zOrder : zOrder, true))
	            : new TiledContainer();
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
	            const smeta = meta;
	            const frame = smeta.image ? tileset.getTileByTile(smeta.image) : tileset.getTileByGid(smeta.gid);
	            smeta.image = frame;
	            const sprite = Build(smeta);
	            if (frame && frame.texture) {
	                sprite.texture = frame.texture;
	                sprite.tileFrame = frame;
	                if (smeta.fromImageLayer) {
	                    frame.texture.baseTexture.once('update', () => {
	                        sprite.scale.set(1);
	                    });
	                }
	            }
	            if (smeta.fromImageLayer) {
	                sprite.anchor.set(0, 0);
	            }
	            return sprite;
	        },
	        [TiledObjectType.TEXT](meta, tileset) {
	            return Build$1(meta);
	        },
	        [TiledObjectType.DEFAULT](meta, tileset) {
	            return Build$2(meta);
	        },
	    },
	    Build(layer, tileset, zOrder = 0) {
	        const objLayer = layer;
	        const layerContatiner = LayerBuilder.Build(layer, tileset, zOrder);
	        if (!layerContatiner) {
	            return undefined;
	        }
	        if (layer.type === 'imagelayer') {
	            if (!this.__convertLayer(layer)) {
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
	            layerContatiner.addChildAt(obj, localZIndex);
	            localZIndex++;
	        }
	        return layerContatiner;
	    },
	    __convertLayer(imageLayer) {
	        if (!imageLayer.image) {
	            return false;
	        }
	        imageLayer.objects = [
	            {
	                image: {
	                    image: imageLayer.image,
	                },
	                gid: -1,
	                name: imageLayer.name,
	                x: imageLayer.x + imageLayer.offsetx,
	                y: imageLayer.y + imageLayer.offsety,
	                fromImageLayer: true,
	                properties: imageLayer.properties,
	                parsedProps: imageLayer.parsedProps,
	            },
	        ];
	        return true;
	    },
	};

	const Config = {
	    defSpriteAnchor: new PIXI$1.Point(0, 1),
	    debugContainers: false,
	    usePixiDisplay: false,
	    roundFontAlpha: false,
	    injectMiddleware: true
	};
	const LayerBuildersMap = {
	    tilelayer: undefined,
	    objectgroup: ObjectLayerBuilder,
	    imagelayer: ObjectLayerBuilder,
	    group: undefined
	};

	function ApplyMeta(meta, target) {
	    target.name = meta.name;
	    target.tiledId = meta.id;
	    target.width = meta.width || target.width;
	    target.height = meta.height || target.height;
	    target.rotation = ((meta.rotation || 0) * Math.PI) / 180.0;
	    target.x = meta.x || 0;
	    target.y = meta.y || 0;
	    target.visible = meta.visible == undefined ? true : meta.visible;
	    target.types = meta.type ? meta.type.split(":") : [];
	    target.primitive = BuildPrimitive(meta);
	    const props = meta.parsedProps;
	    if (props) {
	        if (!isNaN(props.opacity)) {
	            target.alpha = Number(props.opacity);
	        }
	        Object.assign(target, props);
	        target.properties = props;
	    }
	    target.source = meta;
	    if (Config.debugContainers) {
	        setTimeout(() => {
	            const rect = new PIXI$1.Graphics();
	            rect.lineStyle(2, 0xff0000, 0.7)
	                .drawRect(target.x, target.y, meta.width, meta.height)
	                .endFill();
	            if (target instanceof PIXI$1.Sprite) {
	                rect.y -= target.height;
	            }
	            target.parent.addChild(rect);
	        }, 30);
	    }
	}
	function Build$2(meta) {
	    const types = meta.type ? meta.type.split(":") : [];
	    let container = undefined;
	    if (types.indexOf("mask") > -1) {
	        container = new PIXI$1.Sprite(PIXI$1.Texture.WHITE);
	    }
	    else {
	        container = new TiledContainer();
	    }
	    if (meta.gid) {
	        if (container instanceof PIXI$1.Sprite) {
	            container.anchor = Config.defSpriteAnchor;
	        }
	        else {
	            container.pivot = Config.defSpriteAnchor;
	            container.hitArea = new PIXI$1.Rectangle(0, 0, meta.width, meta.height);
	        }
	    }
	    ApplyMeta(meta, container);
	    return container;
	}

	var ContainerBuilder = /*#__PURE__*/Object.freeze({
		__proto__: null,
		ApplyMeta: ApplyMeta,
		Build: Build$2
	});

	const VERSION = "1.1.11";
	const Builders = [
	    Build$2,
	    Build,
	    Build$1
	];
	function Inject(pixiPack = window.PIXI, props = undefined) {
	    if (!pixiPack) {
	        console.warn("Auto injection works only with globals scoped PIXI, not in modules\nuse 'Loader.registerPlugin(Parser)' otherwith");
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

	exports.Builders = Builders;
	exports.Config = Config;
	exports.ContainerBuilder = ContainerBuilder;
	exports.CreateStage = CreateStage;
	exports.Inject = Inject;
	exports.MultiSpritesheet = MultiSpritesheet;
	exports.Parser = Parser;
	exports.Primitives = TiledPrimitives;
	exports.SpriteBuilder = SpriteBuilder;
	exports.TextBuilder = TextBuilder;
	exports.TiledContainer = TiledContainer;
	exports.VERSION = VERSION;

	return exports;

}({}, PIXI));

// Inject to PIXI namespace 
 PIXI["TiledOG"] = TiledOG;
