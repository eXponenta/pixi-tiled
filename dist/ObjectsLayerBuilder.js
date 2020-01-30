"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var LayerBuilder_1 = require("./LayerBuilder");
var Utils_1 = require("./Utils");
var SB = __importStar(require("./SpriteBuilder"));
var TB = __importStar(require("./TextBuilder"));
var CB = __importStar(require("./ContainerBuilder"));
exports.ObjectLayerBuilder = {
    __gen: (_a = {},
        _a[Utils_1.TiledObjectType.IMAGE] = function (meta, tileset) {
            var smeta = meta;
            var frame = smeta.image ? tileset.getTileByTile(smeta.image) : tileset.getTileByGid(smeta.gid);
            smeta.image = frame;
            var sprite = SB.Build(smeta);
            if (frame && frame.texture) {
                sprite.texture = frame.texture;
                sprite.tileFrame = frame;
                if (smeta.fromImageLayer) {
                    frame.texture.baseTexture.once('update', function () {
                        sprite.scale.set(1);
                    });
                }
            }
            if (smeta.fromImageLayer) {
                sprite.anchor.set(0, 0);
            }
            return sprite;
        },
        _a[Utils_1.TiledObjectType.TEXT] = function (meta, tileset) {
            return TB.Build(meta);
        },
        _a[Utils_1.TiledObjectType.DEFAULT] = function (meta, tileset) {
            return CB.Build(meta);
        },
        _a),
    Build: function (layer, tileset, zOrder) {
        if (zOrder === void 0) { zOrder = 0; }
        var objLayer = layer;
        var layerContatiner = LayerBuilder_1.LayerBuilder.Build(layer, tileset, zOrder);
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
        var objects = objLayer.objects;
        var localZIndex = 0;
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var objMeta = objects_1[_i];
            Utils_1._prepareProperties(objMeta);
            var type = Utils_1.Objectype(objMeta);
            var method = this.__gen[type] || this.__gen[Utils_1.TiledObjectType.DEFAULT];
            var obj = method.call(this, objMeta, tileset);
            if (!obj) {
                continue;
            }
            layerContatiner.addChildAt(obj, localZIndex);
            localZIndex++;
        }
        return layerContatiner;
    },
    __convertLayer: function (imageLayer) {
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
//# sourceMappingURL=ObjectsLayerBuilder.js.map