
import { Sprite } from "@pixi/sprite";
import { ITiledSprite } from "../ITiledMap";
import { TiledSprite } from "./../objects/TiledSprite";

export function Build(meta: ITiledSprite): TiledSprite {
	// legacy
	const sprite = new TiledSprite(meta, true);

	return sprite;
}
