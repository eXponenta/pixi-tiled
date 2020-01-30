"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
var pixi_js_1 = require("pixi.js");
var ContainerBuilder = __importStar(require("./ContainerBuilder"));
var Primitives = __importStar(require("./TiledPrimitives"));
function Build(meta) {
    var sprite = new pixi_js_1.Sprite(pixi_js_1.Texture.EMPTY);
    if (!meta.fromImageLayer) {
        sprite.anchor = Config_1.Config.defSpriteAnchor;
    }
    ContainerBuilder.ApplyMeta(meta, sprite);
    var obj = meta.image.objectgroup;
    if (obj) {
        sprite.primitive = Primitives.BuildPrimitive(obj.objects[0]);
    }
    var hFlip = meta.hFlip;
    var vFlip = meta.vFlip;
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
exports.Build = Build;
//# sourceMappingURL=SpriteBuilder.js.map