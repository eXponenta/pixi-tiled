import { TiledContainer } from "./TiledContainer";
import { Config } from "./Config";
import {
	Sprite,
	Rectangle,
	Texture,
	Graphics,
} from "pixi.js";

import * as Primitives from "./TiledPrimitives";
import { ITiledObject, ITiledLayer, ITiledTile } from "./ITiledMap";
import { TiledSprite } from "./TiledSprite";

export function ApplyMeta(meta: ITiledObject | ITiledLayer, target: TiledContainer) {
	target.name = meta.name;
	target.tiledId = meta.id;
	target.width = meta.width || target.width;
	target.height = meta.height || target.height;
	target.rotation = (((meta as ITiledObject).rotation || 0) * Math.PI) / 180.0;

	target.x = meta.x || 0;
	target.y = meta.y || 0;

	target.visible = meta.visible == undefined ? true : meta.visible;
	target.types = meta.type ? meta.type.split(":") : [];

	target.primitive = Primitives.BuildPrimitive(meta as ITiledObject);

	const props = meta.parsedProps;

	if (props) {
		if (!isNaN(props.opacity as number)) {
			target.alpha = Number(props.opacity);
		}

		//@ts-ignore
		Object.assign(target, props);

		target.properties = props;
	}

	target.source = meta;

	if (Config.debugContainers) {
		setTimeout(() => {
			const rect = new Graphics();

			rect.lineStyle(2, 0xff0000, 0.7)
				.drawRect(target.x, target.y, meta.width, meta.height)
				.endFill();
			if (target instanceof Sprite) {
				rect.y -= target.height;
			}
			target.parent.addChild(rect);
		}, 30);
	}
}

export function Build(meta: ITiledObject): TiledContainer | TiledSprite {
	const types: Array<string> = meta.type ? meta.type.split(":") : [];

	let container = undefined; // new TiledOG.TiledContainer();

	if (types.indexOf("mask") > -1) {
		container = new TiledSprite( { texture: Texture.WHITE, id: -1} as ITiledTile);
	} else {
		container = new TiledContainer();
	}

	if (meta.gid) {
		if (container instanceof Sprite) {
			container.anchor = Config.defSpriteAnchor as any;
		} else {
			container.pivot = Config.defSpriteAnchor as any;
			container.hitArea = new Rectangle(0, 0, meta.width, meta.height);
		}
	}

	ApplyMeta(meta, container as TiledContainer);

	return container;
}
