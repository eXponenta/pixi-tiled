import { ITiledLayer, ITiledImageLayer } from './ITiledMap';
import { TiledContainer } from './TiledContainer';
import { TilesetManager } from './TilesetManagers';
import { TiledObjectType } from './Utils';
export declare const ObjectLayerBuilder: {
    __gen: Record<TiledObjectType, (...args: any[]) => TiledContainer>;
    Build(layer: ITiledLayer, tileset: TilesetManager, zOrder?: number): TiledContainer | undefined;
    __convertLayer(imageLayer: ITiledImageLayer): boolean;
};
