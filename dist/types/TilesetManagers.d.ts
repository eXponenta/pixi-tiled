import { ITiledTileset, ITiledTile } from './ITiledMap';
import { MultiSpritesheet } from './TiledMultiSheet';
import { Spritesheet, Texture, utils, ITextureDictionary } from 'pixi.js';
export declare class TilesetManager extends utils.EventEmitter {
    private _tileSets;
    private _sheet;
    private _loadQueue;
    baseUrl: string;
    loadUnknowImages: boolean;
    constructor(_tileSets: ITiledTileset[], sheet?: MultiSpritesheet | Spritesheet | ITextureDictionary);
    register(spritesheet: MultiSpritesheet | Spritesheet): void;
    readonly spritesheet: MultiSpritesheet;
    getTileByGid(gid: number, tryLoad?: boolean): ITiledTile | undefined;
    getTileByTile(tile: ITiledTile | null, tryLoad?: boolean, skipAnim?: boolean): ITiledTile | undefined;
    getTileSetByGid(gid: number): ITiledTileset | undefined;
    _cropTile(set: ITiledTileset, tile: ITiledTile, texture: Texture): Texture;
    _tryLoadTexture(url: string, tile: ITiledTile): Texture;
    readonly loaded: boolean;
}
