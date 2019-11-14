"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var TiledContainer_1 = require("./TiledContainer");
var Config_1 = require("./Config");
var Utils = __importStar(require("./Utils"));
var ContainerBuilder = __importStar(require("./ContainerBuilder"));
var TextBuilder = __importStar(require("./TextBuilder"));
var SpriteBuilder = __importStar(require("./SpriteBuilder"));
var showHello = true;
function _prepareProperties(layer) {
    var props = {};
    if (layer.properties) {
        if (layer.properties instanceof Array) {
            for (var _i = 0, _a = layer.properties; _i < _a.length; _i++) {
                var p = _a[_i];
                var val = p.value;
                if (p.type == "color") {
                    val = Utils.HexStringToHexInt(val);
                }
                props[p.name] = val;
            }
        }
        else {
            props = layer.properties;
        }
    }
    if (layer.gid) {
        var gid = layer.gid;
        var vFlip = gid & 0x40000000;
        var hFlip = gid & 0x80000000;
        var dFlip = gid & 0x20000000;
        props["vFlip"] = vFlip;
        props["hFlip"] = hFlip;
        props["dFlip"] = dFlip;
        var realGid = gid & (~(0x40000000 | 0x80000000 | 0x20000000));
        layer.gid = realGid;
    }
    layer.properties = props;
}
function _getImageFromTileset(tilesets, baseUrl, gid) {
    var tileSet = undefined;
    for (var i = 0; i < tilesets.length; i++) {
        if (tilesets[i].firstgid <= gid) {
            tileSet = tilesets[i];
        }
    }
    if (!tileSet) {
        console.log("Image with gid:" + gid + " not found!");
        return null;
    }
    var realGid = gid - tileSet.firstgid;
    var find = tileSet.tiles.filter(function (obj) { return obj.id == realGid; })[0];
    var img = Object.assign({}, find);
    if (!img) {
        console.log("Load res MISSED gid:" + realGid);
        return null;
    }
    img.image = baseUrl + img.image;
    return img;
}
function CreateStage(res, loader) {
    var _data = {};
    if (res instanceof pixi_js_1.LoaderResource) {
        _data = res.data;
    }
    else {
        _data = loader;
    }
    if (!_data || _data.type != "map") {
        return undefined;
    }
    if (showHello) {
        console.log("[TILED] Importer!\neXponenta {rondo.devil[a]gmail.com}");
        showHello = false;
    }
    var useDisplay = !!Config_1.Config.usePixiDisplay && PIXI.display !== undefined;
    var Layer = useDisplay ? PIXI.display.Layer : {};
    var Group = useDisplay ? PIXI.display.Group : {};
    var Stage = useDisplay ? PIXI.display.Stage : {};
    var _stage = new TiledContainer_1.TiledContainer();
    var cropName = new RegExp(/^.*[\\\/]/);
    _stage.layerHeight = _data.height;
    _stage.layerWidth = _data.width;
    var baseUrl = "";
    if (res instanceof pixi_js_1.LoaderResource) {
        _stage.name = res.url.replace(cropName, "").split(".")[0];
        baseUrl = res.url.replace(loader.baseUrl, "");
        baseUrl = baseUrl.match(cropName)[0];
    }
    if (_data.layers) {
        var zOrder = 0;
        if (useDisplay) {
            _data.layers = _data.layers.reverse();
        }
        for (var _i = 0, _a = _data.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            if (layer.type !== "objectgroup" && layer.type !== "imagelayer") {
                console.warn("[TILED] Importer support only OBJECT or IMAGE layers yet!");
                continue;
            }
            _prepareProperties(layer);
            var props = layer.properties;
            if (props.ignore || props.ignoreLoad) {
                console.log("[TILED] layer ignored:" + layer.name);
                continue;
            }
            var pixiLayer = useDisplay
                ? new Layer(new Group(props.zOrder !== undefined ? props.zOrder : zOrder, true))
                : new TiledContainer_1.TiledContainer();
            zOrder++;
            pixiLayer.tiledId = layer.id;
            pixiLayer.name = layer.name;
            _stage.layers = {};
            _stage.layers[layer.name] = pixiLayer;
            pixiLayer.visible = layer.visible;
            pixiLayer.position.set(layer.x, layer.y);
            pixiLayer.alpha = layer.opacity || 1;
            ContainerBuilder.ApplyMeta(layer, pixiLayer);
            _stage.addChild(pixiLayer);
            if (layer.type == "imagelayer") {
                layer.objects = [
                    {
                        img: {
                            image: baseUrl + layer.image
                        },
                        gid: -1,
                        name: layer.name,
                        x: layer.x + layer.offsetx,
                        y: layer.y + layer.offsety,
                        fromImageLayer: true,
                        properties: layer.properties
                    }
                ];
            }
            if (!layer.objects) {
                return undefined;
            }
            var localZIndex = 0;
            var _loop_1 = function (layerObj) {
                _prepareProperties(layerObj);
                if (layerObj.properties.ignore) {
                    return "continue";
                }
                var type = Utils.Objectype(layerObj);
                var pixiObject = null;
                switch (type) {
                    case Utils.TiledObjectType.IMAGE: {
                        if (!layerObj.fromImageLayer) {
                            var img = _getImageFromTileset(_data.tilesets, baseUrl, layerObj.gid);
                            if (!img) {
                                return "continue";
                            }
                            layerObj.img = img;
                        }
                        pixiObject = SpriteBuilder.Build(layerObj);
                        var sprite_1 = pixiObject;
                        var cached_1 = undefined;
                        if (loader instanceof pixi_js_1.Loader) {
                            cached_1 = loader.resources[layerObj.img.image];
                        }
                        else if (res.textures) {
                            cached_1 = res.textures[layerObj.img.image];
                        }
                        if (!cached_1) {
                            if (loader instanceof pixi_js_1.Loader) {
                                loader.add(layerObj.img.image, Object.assign(res.metadata, {
                                    parentResource: res
                                }), function () {
                                    var tex = loader.resources[layerObj.img.image].texture;
                                    sprite_1.texture = tex;
                                    if (layerObj.fromImageLayer) {
                                        sprite_1.scale.set(1);
                                    }
                                });
                            }
                            else {
                                return "continue";
                            }
                        }
                        else {
                            if (cached_1 instanceof pixi_js_1.LoaderResource) {
                                if (!cached_1.isComplete) {
                                    cached_1.onAfterMiddleware.once(function (e) {
                                        sprite_1.texture = cached_1.texture;
                                        if (layerObj.fromImageLayer) {
                                            sprite_1.scale.set(1);
                                        }
                                    });
                                }
                                else {
                                    sprite_1.texture = cached_1.texture;
                                    if (layerObj.fromImageLayer) {
                                        sprite_1.scale.set(1);
                                    }
                                }
                            }
                            else if (cached_1) {
                                sprite_1.texture = cached_1;
                                if (layerObj.fromImageLayer) {
                                    sprite_1.scale.set(1);
                                }
                            }
                        }
                        break;
                    }
                    case Utils.TiledObjectType.TEXT: {
                        pixiObject = TextBuilder.Build(layerObj);
                        break;
                    }
                    default: {
                        pixiObject = ContainerBuilder.Build(layerObj);
                    }
                }
                if (Config_1.Config.usePixiDisplay) {
                    pixiObject.parentGroup = pixiLayer.group;
                    _stage.addChildAt(pixiObject, localZIndex);
                }
                else {
                    pixiLayer.addChildAt(pixiObject, localZIndex);
                }
                localZIndex++;
            };
            for (var _b = 0, _c = layer.objects; _b < _c.length; _b++) {
                var layerObj = _c[_b];
                _loop_1(layerObj);
            }
        }
    }
    return _stage;
}
exports.CreateStage = CreateStage;
exports.Parser = {
    Parse: function (res, next) {
        var stage = CreateStage(res, this);
        res.stage = stage;
        next();
    },
    use: function (res, next) {
        exports.Parser.Parse.call(this, res, next);
    },
    add: function () {
        console.log("Congratulations! Now you use Tiled importer!");
    }
};
//# sourceMappingURL=TiledObjectParser.js.map