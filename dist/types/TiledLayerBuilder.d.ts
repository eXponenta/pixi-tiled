import { ITiledLayer, ITiledTileLayer } from './ITiledMap';
import { TilesetManager } from './TilesetManagers';
import { TiledMapContainer } from './TiledMapContainer';
import { TiledContainer } from './index';
import { TileAnimator } from './TiledAnimator';
export declare const TiledLayerBuilder: {
    Build(layer: ITiledLayer, set: TilesetManager, zOrder: number | undefined, tileMap: TiledMapContainer): (TiledContainer & {
        animators: Map<string, TileAnimator>;
    }) | undefined;
    __decodeData(layer: ITiledTileLayer): number[];
};
