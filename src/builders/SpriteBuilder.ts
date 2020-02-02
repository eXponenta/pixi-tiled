
import { Sprite } from "pixi.js";
import { ITiledSprite } from "../ITiledMap";
import { TiledSprite } from "./../objects/TiledSprite";

export function Build(meta: ITiledSprite): Sprite {
	// legacy
	const sprite = new TiledSprite(meta, true);

	return sprite;
}
