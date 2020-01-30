"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var TiledContainer_1 = require("./TiledContainer");
var Config_1 = require("./Config");
var TilesetManagers_1 = require("./TilesetManagers");
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
    if (!_data || _data.type != 'map') {
        return undefined;
    }
    if (showHello) {
        console.log('[TILED] Importer!\neXponenta {rondo.devil[a]gmail.com}');
        showHello = false;
    }
    var useDisplay = !!Config_1.Config.usePixiDisplay && PIXI.display !== undefined;
    var sheet = res.textures ? res : undefined;
    var stage = new TiledContainer_1.TiledContainer();
    var cropName = new RegExp(/^.*[\\\/]/);
    stage.layerHeight = _data.height;
    stage.layerWidth = _data.width;
    stage.source = _data;
    var baseUrl = '';
    if (res instanceof pixi_js_1.LoaderResource) {
        stage.name = res.url.replace(cropName, '').split('.')[0];
        baseUrl = res.url.replace(loader.baseUrl, '');
        baseUrl = baseUrl.match(cropName)[0];
    }
    if (_data.layers) {
        var setManager = new TilesetManagers_1.TilesetManager(_data.tilesets, sheet);
        setManager.baseUrl = baseUrl;
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
            var pixiLayer = builder.Build(layer, setManager, zOrder);
            if (!pixiLayer) {
                continue;
            }
            zOrder++;
            stage.layers = (_a = {},
                _a[layer.name] = pixiLayer,
                _a);
            stage.addChild(pixiLayer);
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
        console.log('[TILED] middleware registered!');
    },
};
//# sourceMappingURL=TiledObjectParser.js.map