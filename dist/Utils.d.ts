import { ITiledTileset, ITiledMap, ITiledLayer, ITiledObject } from "./ITiledMap";
export declare function HexStringToHexInt(value: string | number): number;
export declare function HexStringToAlpha(value: string | number): number;
export declare enum TiledObjectType {
    DEFAULT = 0,
    POINT = 1,
    POLYGON = 2,
    POLYLINE = 3,
    ELLIPSE = 4,
    TEXT = 5,
    IMAGE = 6
}
export declare function Objectype(meta: any): TiledObjectType;
export declare function resolveImageUrl(tilesets: ITiledTileset[], baseUrl: string, gid: number): import("./ITiledMap").ITiledTile | null;
export declare function _prepareProperties(layer: ITiledMap | ITiledLayer | ITiledObject): void;
