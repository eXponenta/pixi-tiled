import { ITiledLayer } from './ITiledMap';
import { TiledContainer } from '.';
import { TilesetManager } from './TilesetManagers';
export declare const LayerBuilder: {
    Build(layer: ITiledLayer, tileset: TilesetManager, zOrder?: number): TiledContainer | undefined;
};
