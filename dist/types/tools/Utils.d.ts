import { ITiledTileset, ITiledMap, ITiledLayer, ITiledObject, ITiledTile } from '../ITiledMap';
import { TiledContainer } from './../objects/TiledContainer';
export declare function HexStringToHexInt(value: string | number): number;
export declare function HexStringToAlpha(value: string | number): number;
export declare function resolveTile(tilesets: ITiledTileset[], gid: number): (ITiledTile & {
    tilesetId: number;
}) | null;
export declare function _prepareProperties(layer: ITiledMap | ITiledLayer | ITiledObject): void;
export declare function ApplyMeta(meta: ITiledObject | ITiledLayer, target: TiledContainer): void;
