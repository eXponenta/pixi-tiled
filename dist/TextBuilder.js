"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TiledContainer_1 = require("./TiledContainer");
var pixi_js_1 = require("pixi.js");
var Config_1 = require("./Config");
var ContainerBuilder = __importStar(require("./ContainerBuilder"));
var Utils = __importStar(require("./Utils"));
function Build(meta) {
    var container = new TiledContainer_1.TiledContainer();
    var text = meta.text;
    var pixiText = new pixi_js_1.Text(text.text, {
        wordWrap: text.wrap,
        wordWrapWidth: meta.width,
        fill: Utils.HexStringToHexInt(text.color || "#000000") || 0x000000,
        align: text.valign || "top",
        fontFamily: text.fontfamily || "sans-serif",
        fontWeight: text.bold ? "bold" : "normal",
        fontStyle: text.italic ? "italic" : "normal",
        fontSize: text.pixelsize || "16px"
    });
    pixiText.name = meta.name + "_Text";
    pixiText.roundPixels = !!Config_1.Config.roundFontAlpha;
    var props = meta.parsedProps;
    meta.properties = [];
    meta.parsedProps = {};
    ContainerBuilder.ApplyMeta(meta, container);
    container.pivot.set(0, 0);
    switch (text.halign) {
        case "right":
            {
                pixiText.anchor.x = 1;
                pixiText.position.x = meta.width;
            }
            break;
        case "center":
            {
                pixiText.anchor.x = 0.5;
                pixiText.position.x = meta.width * 0.5;
            }
            break;
        default:
            {
                pixiText.anchor.x = 0;
                pixiText.position.x = 0;
            }
            break;
    }
    switch (text.valign) {
        case "bottom":
            {
                pixiText.anchor.y = 1;
                pixiText.position.y = meta.height;
            }
            break;
        case "center":
            {
                pixiText.anchor.y = 0.5;
                pixiText.position.y = meta.height * 0.5;
            }
            break;
        default:
            {
                pixiText.anchor.y = 0;
                pixiText.position.y = 0;
            }
            break;
    }
    if (props) {
        pixiText.style.stroke =
            Utils.HexStringToHexInt(props.strokeColor) || 0;
        pixiText.style.strokeThickness = props.strokeThickness || 0;
        pixiText.style.padding = props.fontPadding || 0;
        Object.assign(pixiText, props);
    }
    container.addChild(pixiText);
    container.text = pixiText;
    container.properties = props;
    return container;
}
exports.Build = Build;
//# sourceMappingURL=TextBuilder.js.map