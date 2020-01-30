import { ITiledLayer } from "./ITiledMap";
import { TiledContainer } from ".";
export declare const ObjectLayerBuilder: {
    Build(layer: ITiledLayer, zOrder?: number): TiledContainer | undefined;
};
