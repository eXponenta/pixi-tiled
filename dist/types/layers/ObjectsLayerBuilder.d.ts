import { ITiledLayer, ITiledImageLayer } from '../ITiledMap';
import { TiledContainer } from '../objects/TiledContainer';
import { TilesetManager } from '../tools/TilesetManagers';
import { TiledObjectType } from '../tools/TiledObjectType';
export declare const ObjectLayerBuilder: {
    __gen: Record<TiledObjectType, (...args: any[]) => TiledContainer>;
    Build(layer: ITiledLayer, tileset: TilesetManager, zOrder?: number): TiledContainer | undefined;
    __convertLayer(imageLayer: ITiledImageLayer): boolean;
};
