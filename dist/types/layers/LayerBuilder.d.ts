import { ITiledLayer } from '../ITiledMap';
import { TiledContainer } from './../objects/TiledContainer';
import { TilesetManager } from '../tools/TilesetManagers';
export interface ILayerBuilder {
    Build(meta: ITiledLayer, tileset: TilesetManager, ...args: any[]): TiledContainer | undefined;
}
export declare const LayerBuilder: {
    Build(layer: ITiledLayer, tileset: TilesetManager, zOrder?: number): TiledContainer | undefined;
};
