import { ITiledLayer, ITiledTileLayer } from '../ITiledMap';
import { TilesetManager } from '../tools/TilesetManagers';
import { TiledMapContainer } from '../objects/TiledMapContainer';
import { TiledContainer } from '../index';
import { TileAnimator } from '../objects/TiledAnimator';
export declare const TiledLayerBuilder: {
    Build(layer: ITiledLayer, set: TilesetManager, zOrder: number | undefined, tileMap: TiledMapContainer): (TiledContainer & {
        animators: Map<string, TileAnimator>;
    }) | undefined;
    __decodeData(layer: ITiledTileLayer): number[];
};
