import { ITiledTileset, ITiledTile } from './ITiledMap';
import { MultiSpritesheet } from './TiledMultiSheet';
import { Spritesheet } from 'pixi.js';
export declare class TilesetManager {
    private _tileSets;
    private _sheet;
    baseUrl: string;
    loadUnknowImages: boolean;
    constructor(_tileSets: ITiledTileset[], sheet?: MultiSpritesheet | Spritesheet);
    register(spritesheet: MultiSpritesheet | Spritesheet): void;
    readonly spritesheet: MultiSpritesheet;
    getTextureByGid(gid: number, tryLoad?: boolean): ITiledTile | undefined;
    getTextureByTile(tile: ITiledTile | null, tryLoad?: boolean): ITiledTile | undefined;
}
