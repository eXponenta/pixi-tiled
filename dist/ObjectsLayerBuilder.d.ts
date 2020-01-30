import { ITiledLayer, ITiledImageLayer, ITiledObject } from './ITiledMap';
import { TiledContainer } from './TiledContainer';
import { TilesetManager } from './TilesetManagers';
import { TiledObjectType } from './Utils';
declare type TGeneratorType = (obj: ITiledObject, ts: TilesetManager) => TiledContainer | undefined;
export declare const ObjectLayerBuilder: {
    __gen: Record<TiledObjectType, TGeneratorType | undefined>;
    Build(layer: ITiledLayer, tileset: TilesetManager, zOrder?: number): TiledContainer | undefined;
    __convertLayer(imageLayer: ITiledImageLayer): boolean;
};
export {};
