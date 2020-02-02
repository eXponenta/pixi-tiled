/// <reference types="pixi.js" />
import { ILayerBuilder } from "./layers/LayerBuilder";
export interface ITiledProps {
    defSpriteAnchor: PIXI.Point;
    debugContainers: boolean;
    usePixiDisplay: boolean;
    roundFontAlpha: boolean;
    injectMiddleware: boolean;
    roundPixels: boolean;
}
export declare const Config: ITiledProps;
export declare const LayerBuildersMap: {
    [key: string]: ILayerBuilder | undefined;
};
