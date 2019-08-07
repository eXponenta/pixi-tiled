"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ContainerBuilder = __importStar(require("./ContainerBuilder"));
exports.ContainerBuilder = ContainerBuilder;
var SpriteBuilder = __importStar(require("./SpriteBuilder"));
exports.SpriteBuilder = SpriteBuilder;
var TextBuilder = __importStar(require("./TextBuilder"));
exports.TextBuilder = TextBuilder;
var TiledObjectParser_1 = require("./TiledObjectParser");
exports.Parser = TiledObjectParser_1.Parser;
exports.CreateStage = TiledObjectParser_1.CreateStage;
var Config_1 = require("./Config");
exports.Config = Config_1.Config;
var TiledContainer_1 = require("./TiledContainer");
exports.TiledContainer = TiledContainer_1.TiledContainer;
var pixi_utils_1 = __importDefault(require("./pixi-utils"));
exports.Builders = [
    ContainerBuilder.Build,
    SpriteBuilder.Build,
    TextBuilder.Build
];
function Inject(pixiPack, props) {
    if (pixiPack === void 0) { pixiPack = window.PIXI; }
    if (props === void 0) { props = undefined; }
    if (!pixiPack) {
        console.warn("Auto injection works only with globals scoped PIXI, not in modules\nuse \'Loader.registerPlugin(Parser)\' otherwith");
        return;
    }
    if (props) {
        Object.assign(Config_1.Config, props);
    }
    pixi_utils_1.default(pixiPack);
    if (Config_1.Config.injectMiddleware) {
        pixiPack.Loader.registerPlugin(TiledObjectParser_1.Parser);
    }
}
exports.Inject = Inject;
var Primitives = __importStar(require("./TiledPrimitives"));
exports.Primitives = Primitives;
var TiledMultiSheet_1 = __importDefault(require("./TiledMultiSheet"));
exports.MultiSpritesheet = TiledMultiSheet_1.default;
//# sourceMappingURL=index.js.map