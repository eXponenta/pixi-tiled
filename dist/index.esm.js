/*
	PIXI v5 Tiled support lib, version 1.1.15
	Author: eXponenta <rondo.devil@gmail.com> 
*/
import { Container, Point, Rectangle, Polygon, Ellipse, AnimatedSprite, Sprite, Graphics, Texture, Text, resources, utils, BaseTexture, Matrix } from 'pixi.js';

class TiledContainer extends Container {
    constructor() {
        super(...arguments);
        this.layerHeight = 0;
        this.layerWidth = 0;
    }
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

function HexStringToHexInt(value) {
    if (!value)
        return 0;
    if (typeof value == 'number')
        return value;
    value = value.length > 7 ? value.substr(3, 6) : value.substr(1, 6);
    try {
        return parseInt(value, 16);
    }
    catch (e) {
        console.warn('Color parse error:', e.message);
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
function resolveTile(tilesets, gid) {
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
        console.error('Image with gid:' + gid + ' not found!');
        return null;
    }
    const realGid = gid - tileSet.firstgid;
    let find = tileSet.tiles.filter(obj => obj.id == realGid)[0];
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

class TiledRect extends Rectangle {
    constructor() {
        super(...arguments);
        this.name = "";
        this.types = [];
        this.visible = true;
    }
}
class TiledPoint extends Point {
    constructor(x, y) {
        super(x, y);
        this.name = "";
        this.types = [];
        this.visible = true;
    }
}
class TiledPolygon extends Polygon {
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
class TiledPolypine {
    constructor(points) {
        this.name = "";
        this.types = [];
        this.visible = true;
        this.points = [];
        this.points = points.slice();
    }
}
class TiledEllipse extends Ellipse {
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

class TileAnimator {
    constructor(tile) {
        this._childs = new Set();
        if (!tile.animation) {
            throw new Error("Tile has not animation!");
        }
        this._tile = tile;
        this._animator = new AnimatedSprite(tile.animation);
        this._animator.onFrameChange = this.__onFrame.bind(this);
    }
    __onFrame() {
        this._childs.forEach((e) => e.texture = this._animator.texture);
    }
    get anim() {
        return this._animator;
    }
    add(s, strict = true) {
        if (!s)
            return;
        if (this._childs.has(s))
            return;
        s.anim = this;
        if (s.tileFrame !== this._tile && strict) {
            throw (`Invalid sprite! One Animator per tile type! Pased ${s.tileFrame.id} should be ${this._tile.id}`);
        }
        this._childs.add(s);
    }
    remove(s) {
        this._childs.delete(s);
    }
}

class TiledSprite extends Sprite {
    constructor(tile, createAnimator = false) {
        super(tile.texture);
        this.tileFrame = tile;
        if (createAnimator && this.tileFrame.animation) {
            this.anim = new TileAnimator(this.tileFrame);
        }
    }
    set anim(anim) {
        if (anim === this._animator)
            return;
        if (this._animator) {
            this._animator.remove(this);
        }
        this._animator = anim;
        anim && anim.add(this);
    }
    get anim() {
        return this._animator;
    }
}

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
function Build(meta) {
    const types = meta.type ? meta.type.split(":") : [];
    let container = undefined;
    if (types.indexOf("mask") > -1) {
        container = new TiledSprite({ texture: Texture.WHITE, id: -1 });
    }
    else {
        container = new TiledContainer();
    }
    if (meta.gid) {
        if (container instanceof Sprite) {
            container.anchor = Config.defSpriteAnchor;
        }
        else {
            container.pivot = Config.defSpriteAnchor;
            container.hitArea = new Rectangle(0, 0, meta.width, meta.height);
        }
    }
    ApplyMeta(meta, container);
    return container;
}

var ContainerBuilder = /*#__PURE__*/Object.freeze({
	__proto__: null,
	ApplyMeta: ApplyMeta,
	Build: Build
});

function Build$1(meta) {
    const sprite = new TiledSprite(meta.image, true);
    if (sprite.anim) {
        const a = sprite.anim.anim;
        (meta.parsedProps.animPlaying) && a.play();
        a.loop = meta.parsedProps.animLoop !== undefined ? !!meta.parsedProps.animLoop : true;
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
	Build: Build$1
});

function Build$2(meta) {
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
	Build: Build$2
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

class FixedImageResource extends resources.ImageResource {
    load() {
        return new Promise((res, rej) => {
            const rejector = {
                onError: rej,
            };
            this.onError.add(rejector);
            super.load().then(res);
        });
    }
}
class TilesetManager extends utils.EventEmitter {
    constructor(_tileSets, sheet) {
        super();
        this._tileSets = _tileSets;
        this._sheet = new MultiSpritesheet();
        this._loadQueue = 0;
        this.baseUrl = '';
        this.loadUnknowImages = true;
        if (sheet) {
            if (sheet.textures) {
                this.register(sheet);
            }
            else {
                Object.keys(sheet).forEach(e => {
                    this._sheet.addTexture(sheet[e], e);
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
        if (!tile.image && set.image) {
            tile.fromSheet = true;
            tile.image = set.image;
        }
        if (!tile.image) {
            return undefined;
        }
        if (tile.animation && !skipAnim) {
            tile.animation.forEach(e => {
                const atile = set.tiles[e.tileid];
                atile.tilesetId = tile.tilesetId;
                e.texture = this.getTileByTile(atile, tryLoad, true).texture;
                e.time = e.duration;
            });
        }
        const absUrl = this.baseUrl + tile.image;
        let texture = this.spritesheet.textures[tile.image];
        tile.lazyLoad = false;
        if (!texture && tryLoad) {
            texture = this._tryLoadTexture(absUrl, tile);
            tile.lazyLoad = true;
            this._sheet.addTexture(texture, tile.image);
        }
        if (texture && tile.fromSheet) {
            texture = this._cropTile(set, tile, texture);
        }
        tile.texture = texture;
        return tile;
    }
    getTileSetByGid(gid) {
        const frame = resolveTile(this._tileSets, gid);
        if (!frame) {
            return undefined;
        }
        return this._tileSets[frame.tilesetId];
    }
    _cropTile(set, tile, texture) {
        const colls = set.columns;
        const rows = set.tilecount / colls;
        const margin = set.margin || 0;
        const space = set.spacing || 0;
        const xId = tile.id % colls;
        const yId = tile.id / colls | 0;
        texture = new Texture(texture.baseTexture, new Rectangle(margin + xId * (set.tilewidth + space), margin + yId * (set.tileheight + space), set.tileheight, set.tilewidth));
        this._sheet.addTexture(texture, `${tile.image}_${tile.tilesetId}:${tile.id}`);
        return texture;
    }
    _tryLoadTexture(url, tile) {
        const res = new FixedImageResource(url, {
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
            .catch((e) => {
            console.warn(`Tile set image loading error!`, tile);
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

let showHello = true;
function CreateStage(sheet, _data, baseUrl = '') {
    if (!_data || _data.type != 'map') {
        return undefined;
    }
    if (showHello) {
        console.log('[TILED] Importer!\neXponenta {rondo.devil[a]gmail.com}');
        showHello = false;
    }
    const useDisplay = !!Config.usePixiDisplay && PIXI.display !== undefined;
    const stage = new TiledMapContainer();
    stage.layerHeight = _data.height;
    stage.layerWidth = _data.width;
    stage.source = _data;
    stage.tileSet = new TilesetManager(_data.tilesets, sheet);
    stage.tileSet.baseUrl = baseUrl;
    if (_data.layers) {
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
        const cropName = new RegExp(/^.*[\\\/]/);
        let baseUrl = res.url.replace(this.baseUrl, '');
        baseUrl = baseUrl.match(cropName)[0];
        const stage = CreateStage(res.textures, data, baseUrl);
        if (!stage) {
            next();
            return;
        }
        stage.name = res.url.replace(cropName, '').split('.')[0];
        res.stage = stage;
        if (stage.tileSet.loaded) {
            next();
            return;
        }
        stage.tileSet.once('loaded', () => next());
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
    Container.prototype.getChildByPath = function (path) {
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
    Container.prototype.addGlobalChild = function (...child) {
        this.transform.updateLocalTransform();
        const loc = new Matrix();
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
            const sprite = Build$1(smeta);
            if (smeta.fromImageLayer && frame.lazyLoad) {
                frame.texture.once('loaded', () => {
                    sprite.scale.set(1);
                });
            }
            if (smeta.fromImageLayer) {
                sprite.anchor.set(0);
            }
            return sprite;
        },
        [TiledObjectType.TEXT](meta, tileset) {
            return Build$2(meta);
        },
        [TiledObjectType.DEFAULT](meta, tileset) {
            return Build(meta);
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

const TiledLayerBuilder = {
    Build(layer, set, zOrder = 0, tileMap) {
        const tiledLayer = layer;
        const tileMapSource = tileMap.source;
        const layerContatiner = LayerBuilder.Build(layer, set, zOrder);
        if (!layerContatiner) {
            return undefined;
        }
        const data = this.__decodeData(tiledLayer);
        const { width, height } = layer;
        const { tileheight, tilewidth } = tileMapSource;
        const genTile = (x, y, gid) => {
            const tile = set.getTileByGid(gid);
            const s = new TiledSprite(tile);
            s.x = x * tilewidth;
            s.y = y * tileheight;
            s.roundPixels = Config.roundPixels;
            if (tile && tile.animation) {
                const animators = layerContatiner.animators || new Map();
                const animId = tile.tilesetId + "_" + tile.id;
                let animator = animators.get(animId);
                if (!animator) {
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
                if (!gid) {
                    continue;
                }
                layerContatiner.addChild(genTile(x, y, data[index]));
            }
        }
        return layerContatiner;
    },
    __decodeData(layer) {
        return layer.data;
    },
};

const VERSION = '1.1.15';
Object.assign(LayerBuildersMap, {
    tilelayer: TiledLayerBuilder,
    objectgroup: ObjectLayerBuilder,
    imagelayer: ObjectLayerBuilder,
    group: undefined,
});
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

export { Config, ContainerBuilder, CreateStage, Inject, MultiSpritesheet, Parser, TiledPrimitives as Primitives, SpriteBuilder, TextBuilder, TiledContainer, VERSION };
//# sourceMappingURL=index.esm.js.map
