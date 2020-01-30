"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LayerBuilder_1 = require("./LayerBuilder");
exports.ObjectLayerBuilder = {
    Build: function (layer, zOrder) {
        if (zOrder === void 0) { zOrder = 0; }
        return LayerBuilder_1.LayerBuilder.Build(layer, zOrder);
    }
};
//# sourceMappingURL=ObjectsLayerBuilder.js.map