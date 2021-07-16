import { TiledContainer } from "./../objects/TiledContainer";
import { Text, TextStyle } from "@pixi/text";
import { Config } from "../Config";
import * as Utils from "../tools/Utils";
import { ITiledObject } from "../ITiledMap";
import { ApplyMeta } from "../tools/Utils";

export function Build(meta: ITiledObject): TiledContainer {
	const container = new TiledContainer();
	const text = meta.text!;

	let pixiText = new Text(text.text, {
		wordWrap: text.wrap,
		wordWrapWidth: meta.width,
		fill: Utils.HexStringToHexInt(text.color || "#000000") || 0x000000,
		align: text.valign || "top",
		fontFamily: text.fontfamily || "sans-serif",
		fontWeight: text.bold ? "bold" : "normal",
		fontStyle: text.italic ? "italic" : "normal",
		fontSize: text.pixelsize || "16px"
	} as TextStyle);

	//@ts-ignore
	pixiText.name = meta.name + "_Text";

	pixiText.roundPixels = !!Config.roundFontAlpha;

	const props = meta.parsedProps;

	// clear properties
	meta.properties = [];
	meta.parsedProps = {};

	ApplyMeta(meta, container);
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
			Utils.HexStringToHexInt(props.strokeColor as string) || 0;

		pixiText.style.strokeThickness = +props.strokeThickness || 0;
		pixiText.style.padding = +props.fontPadding || 0;

		Object.assign(pixiText, props);
	}

	//_cont.parentGroup = _layer.group;
	container.addChild(<any> pixiText);

	//@ts-ignore
	container.text = pixiText;

	container.properties = props;

	return container;
}