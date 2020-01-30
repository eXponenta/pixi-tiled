/// <reference types="pixi.js" />
import { ITiledLayer } from "./ITiledMap";
import { TiledContainer } from ".";
export interface ITiledProps {
    defSpriteAnchor?: PIXI.Point;
    debugContainers?: boolean;
    usePixiDisplay?: boolean;
    roundFontAlpha?: boolean;
    injectMiddleware?: boolean;
}
export declare const Config: ITiledProps;
declare type TLayerBuilder = {
    Build(meta: ITiledLayer, ...args: any[]): TiledContainer | undefined;
};
export declare const LayerBuildersMap: {
    [key: string]: TLayerBuilder | undefined;
};
export {};
