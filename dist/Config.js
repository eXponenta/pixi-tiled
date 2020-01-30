"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var ObjectsLayerBuilder_1 = require("./ObjectsLayerBuilder");
exports.Config = {
    defSpriteAnchor: new pixi_js_1.Point(0, 1),
    debugContainers: false,
    usePixiDisplay: false,
    roundFontAlpha: false,
    injectMiddleware: true
};
exports.LayerBuildersMap = {
    tilelayer: undefined,
    objectgroup: ObjectsLayerBuilder_1.ObjectLayerBuilder,
    imagelayer: ObjectsLayerBuilder_1.ObjectLayerBuilder,
    group: undefined
};
//# sourceMappingURL=Config.js.map