import { TiledContainer } from './TiledContainer';
import { Text } from "pixi.js";
import { Config } from './Config';
import * as ContainerBuilder from "./ContainerBuilder";
import * as Utils from "./Utils";
function roundAlpha(canvas) {
    let ctx = canvas.getContext("2d");
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 3; i < data.data.length; i += 4) {
        data.data[i] = data.data[i] > 200 ? 255 : 0;
    }
    ctx.putImageData(data, 0, 0);
}
function createText(meta) {
    let container = new TiledContainer();
    let pixiText = new Text(meta.text.text, {
        wordWrap: meta.text.wrap,
        wordWrapWidth: meta.width,
        fill: Utils.HexStringToHexInt(meta.text.color) || 0x000000,
        align: meta.text.valign || "center",
        fontFamily: meta.text.fontfamily || "Arial",
        fontWeight: meta.text.bold ? "bold" : "normal",
        fontStyle: meta.text.italic ? "italic" : "normal",
        fontSize: meta.text.pixelsize || "16px"
    });
    pixiText.name = meta.name + "_Text";
    if (Config.roundFontAlpha) {
        pixiText.texture.once("update", () => {
            roundAlpha(pixiText.canvas);
            pixiText.texture.baseTexture.update();
            console.log("update");
        });
    }
    const props = meta.properties;
    meta.properties = {};
    ContainerBuilder.ApplyMeta(meta, container);
    container.pivot.set(0, 0);
    switch (meta.text.halign) {
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
    switch (meta.text.valign) {
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
        pixiText.style.stroke = Utils.HexStringToHexInt(meta.properties.strokeColor) || 0;
        pixiText.style.strokeThickness = meta.properties.strokeThickness || 0;
        pixiText.style.padding = meta.properties.fontPadding || 0;
        Object.assign(pixiText, props);
    }
    container.addChild(pixiText);
    container.text = pixiText;
    return container;
}
export function Build(meta) {
    return createText(meta);
}
