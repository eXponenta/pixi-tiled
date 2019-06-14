import { Container, Text } from "pixi.js";
import { ITiledPtimitive } from './TiledPrimitives';
export declare class TiledContainer extends Container {
    layerHeight: number;
    layerWidth: number;
    text?: Text;
    primitive?: ITiledPtimitive;
    tiledId?: number;
}
