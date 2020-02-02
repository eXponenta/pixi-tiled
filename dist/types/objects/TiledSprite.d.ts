import { Sprite } from 'pixi.js';
import { ITiledTile, ITiledSprite } from './../ITiledMap';
import { TileAnimator } from './TiledAnimator';
import { ITiledPtimitive } from './TiledPrimitives';
export declare class TiledSprite extends Sprite {
    tileFrame?: ITiledTile;
    source?: ITiledSprite;
    primitives: ITiledPtimitive[];
    private _animator?;
    constructor(source: ITiledSprite, createAnimator?: boolean, autoInit?: boolean);
    init(): void;
    anim: TileAnimator | undefined;
    clone(): TiledSprite;
}
