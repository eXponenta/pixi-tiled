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
function CreateStage(res, loader) {
    var _a;
    var _data;
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
    var stage = new TiledContainer_1.TiledContainer();
    var cropName = new RegExp(/^.*[\\\/]/);
    stage.layerHeight = _data.height;
    stage.layerWidth = _data.width;
    var baseUrl = "";
    if (res instanceof pixi_js_1.LoaderResource) {
        stage.name = res.url.replace(cropName, "").split(".")[0];
        baseUrl = res.url.replace(loader.baseUrl, "");
        baseUrl = baseUrl.match(cropName)[0];
    }
    if (_data.layers) {
        var zOrder = 0;
        if (useDisplay) {
            _data.layers = _data.layers.reverse();
        }
        for (var _i = 0, _b = _data.layers; _i < _b.length; _i++) {
            var layer = _b[_i];
            var builder = Config_1.LayerBuildersMap[layer.type];
            if (!builder) {
                console.warn("[TILED] Importer can't support " + layer.type + " layer type!");
                continue;
            }
            var pixiLayer = builder.Build(layer, zOrder);
            if (!pixiLayer) {
                continue;
            }
            zOrder++;
            stage.layers = (_a = {},
                _a[layer.name] = pixiLayer,
                _a);
            stage.addChild(pixiLayer);
            if (layer.type == "imagelayer") {
                layer.objects = [
                    {
                        image: {
                            image: baseUrl + layer.image
                        },
                        gid: -1,
                        name: layer.name,
                        x: layer.x + layer.offsetx,
                        y: layer.y + layer.offsety,
                        fromImageLayer: true,
                        properties: layer.properties,
                        parsedProps: layer.parsedProps
                    }
                ];
            }
            var objects = layer
                .objects;
            if (!objects) {
                continue;
            }
            var localZIndex = 0;
            var _loop_1 = function (layerObj) {
                Utils._prepareProperties(layerObj);
                if (layerObj.parsedProps.ignore) {
                    return "continue";
                }
                var type = Utils.Objectype(layerObj);
                var pixiObject = null;
                switch (type) {
                    case Utils.TiledObjectType.IMAGE: {
                        var spriteObj_1 = layerObj;
                        if (!spriteObj_1.fromImageLayer) {
                            var img = Utils.resolveImageUrl(_data.tilesets, baseUrl, layerObj.gid);
                            if (!img) {
                                return "continue";
                            }
                            spriteObj_1.image = img;
                        }
                        pixiObject = SpriteBuilder.Build(spriteObj_1);
                        var sprite_1 = pixiObject;
                        var cached_1 = undefined;
                        if (loader instanceof pixi_js_1.Loader) {
                            cached_1 = loader.resources[spriteObj_1.image.image];
                        }
                        else if (res.textures) {
                            cached_1 = res.textures[spriteObj_1.image.image];
                        }
                        if (!cached_1) {
                            if (loader instanceof pixi_js_1.Loader) {
                                loader.add(spriteObj_1.image.image, Object.assign(res.metadata, {
                                    parentResource: res,
                                    crossOrigin: res
                                        .crossOrigin
                                }), function () {
                                    var tex = loader.resources[spriteObj_1.image.image].texture;
                                    sprite_1.texture = tex;
                                    if (spriteObj_1.fromImageLayer) {
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
                                        if (spriteObj_1.fromImageLayer) {
                                            sprite_1.scale.set(1);
                                        }
                                    });
                                }
                                else {
                                    sprite_1.texture = cached_1.texture;
                                    if (spriteObj_1.fromImageLayer) {
                                        sprite_1.scale.set(1);
                                    }
                                }
                            }
                            else if (cached_1) {
                                sprite_1.texture = cached_1;
                                if (spriteObj_1.fromImageLayer) {
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
                    stage.addChildAt(pixiObject, localZIndex);
                }
                else {
                    pixiLayer.addChildAt(pixiObject, localZIndex);
                }
                localZIndex++;
            };
            for (var _c = 0, objects_1 = objects; _c < objects_1.length; _c++) {
                var layerObj = objects_1[_c];
                _loop_1(layerObj);
            }
        }
    }
    return stage;
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