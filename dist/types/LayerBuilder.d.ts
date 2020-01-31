import { ITiledLayer } from './ITiledMap';
import { TiledContainer } from './TiledContainer';
import { TilesetManager } from './TilesetManagers';
export interface ILayerBuilder {
    Build(meta: ITiledLayer, tileset: TilesetManager, ...args: any[]): TiledContainer | undefined;
}
export declare const LayerBuilder: {
    Build(layer: ITiledLayer, tileset: TilesetManager, zOrder?: number): TiledContainer | undefined;
};
