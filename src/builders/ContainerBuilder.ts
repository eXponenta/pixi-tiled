import { TiledContainer } from "./../objects/TiledContainer";
import { Config } from "../Config";
import {
	Rectangle,
	Texture,
} from "pixi.js";

import { ITiledObject, ITiledSprite } from "../ITiledMap";
import { TiledSprite } from "./../objects/TiledSprite";
import { ApplyMeta } from "../tools/Utils";

export function Build(meta: ITiledObject): TiledContainer | TiledSprite {
	const types: Array<string> = meta.type ? meta.type.split(":") : [];

	let container = undefined; // new TiledOG.TiledContainer();

	if (types.indexOf("mask") > -1) {
		const source = {
			image: {
				texture: Texture.WHITE,
				id: - 1,
			},
			fromImageLayer: true
		} as ITiledSprite
		container = new TiledSprite(source);
	} else {
		container = new TiledContainer();
		ApplyMeta(meta, container as TiledContainer);
	}

	if (meta.gid) {
		container.pivot = Config.defSpriteAnchor as any;
		container.hitArea = new Rectangle(0, 0, meta.width, meta.height);
	}

	return container;
}
