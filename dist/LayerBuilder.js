"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("./Utils");
var Config_1 = require("./Config");
var _1 = require(".");
exports.LayerBuilder = {
    Build: function (layer, zOrder) {
        if (zOrder === void 0) { zOrder = 0; }
        var useDisplay = !!Config_1.Config.usePixiDisplay && PIXI.display !== undefined;
        var Layer = useDisplay ? PIXI.display.Layer : {};
        var Group = useDisplay ? PIXI.display.Group : {};
        Utils_1._prepareProperties(layer);
        var props = layer.parsedProps;
        if (props.ignore || props.ignoreLoad) {
            console.log("[TILED] layer ignored:" + layer.name);
            return undefined;
        }
        var layerObject = useDisplay
            ? new Layer(new Group(props.zOrder !== undefined ? props.zOrder : zOrder, true))
            : new _1.TiledContainer();
        layerObject.tiledId = layer.id;
        layerObject.name = layer.name;
        layerObject.visible = layer.visible;
        layerObject.position.set(layer.x, layer.y);
        layerObject.alpha = layer.opacity || 1;
        _1.ContainerBuilder.ApplyMeta(layer, layerObject);
        return layerObject;
    }
};
//# sourceMappingURL=LayerBuilder.js.map