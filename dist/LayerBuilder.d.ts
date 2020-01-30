import { ITiledLayer } from "./ITiledMap";
import { TiledContainer } from ".";
export declare const LayerBuilder: {
    Build(layer: ITiledLayer, zOrder?: number): TiledContainer | undefined;
};
