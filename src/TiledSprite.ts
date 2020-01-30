import { Sprite } from "pixi.js";
import { ITiledTile } from "./ITiledMap";

export class TiledSprite extends Sprite {
	public tileFrame?: ITiledTile;
}