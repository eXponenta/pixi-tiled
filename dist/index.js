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
pixi_utils_1.default();
exports.Builders = [
    ContainerBuilder.Build,
    SpriteBuilder.Build,
    TextBuilder.Build
];
function Inject(props) {
    if (props === void 0) { props = undefined; }
    if (!window.PIXI) {
        console.warn("Auto injection works only with globals scoped PIXI, not in modules\nuse \'Loader.registerPlugin(Parser)\' otherwith");
        return;
    }
    if (props) {
        Config_1.Config.defSpriteAnchor = props.defSpriteAnchor || Config_1.Config.defSpriteAnchor;
        Config_1.Config.debugContainers = props.debugContainers != undefined
            ? props.debugContainers
            : Config_1.Config.debugContainers;
        Config_1.Config.usePixiDisplay = props.usePixiDisplay != undefined
            ? props.usePixiDisplay
            : Config_1.Config.usePixiDisplay;
        Config_1.Config.roundFontAlpha = props.roundFontAlpha != undefined
            ? props.roundFontAlpha
            : Config_1.Config.roundFontAlpha;
    }
    window.PIXI.Loader.registerPlugin(TiledObjectParser_1.Parser);
}
exports.Inject = Inject;
var Primitives = __importStar(require("./TiledPrimitives"));
exports.Primitives = Primitives;
var TildeMultiSheet_1 = __importDefault(require("./TildeMultiSheet"));
exports.MultiSpritesheet = TildeMultiSheet_1.default;
//# sourceMappingURL=index.js.map