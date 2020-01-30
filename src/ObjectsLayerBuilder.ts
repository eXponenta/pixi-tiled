import { ITiledLayer } from "./ITiledMap";
import { TiledContainer } from ".";
import { LayerBuilder } from "./LayerBuilder";

export const ObjectLayerBuilder = {
    Build(layer: ITiledLayer, zOrder = 0): TiledContainer | undefined {
        return LayerBuilder.Build(layer, zOrder);
    }
}