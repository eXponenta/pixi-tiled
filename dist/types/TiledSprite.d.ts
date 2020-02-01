import { Sprite } from "pixi.js";
import { ITiledTile } from "./ITiledMap";
import { TileAnimator } from "./TiledAnimator";
export declare class TiledSprite extends Sprite {
    tileFrame?: ITiledTile;
    private _animator?;
    constructor(tile: ITiledTile, createAnimator?: boolean);
    anim: TileAnimator | undefined;
}
