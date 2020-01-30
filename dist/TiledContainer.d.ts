import { Container, Text } from "pixi.js";
import { ITiledPtimitive } from './TiledPrimitives';
import { IParsedProps } from "./ITiledMap";
export declare class TiledContainer extends Container {
    layerHeight: number;
    layerWidth: number;
    text?: Text;
    primitive?: ITiledPtimitive;
    tiledId?: number;
    properties?: IParsedProps;
    layers?: {
        [key: string]: Container;
    };
}
