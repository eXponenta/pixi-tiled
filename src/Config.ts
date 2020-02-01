import { Point } from "pixi.js";
import { ILayerBuilder } from "./LayerBuilder";

export interface ITiledProps {
	defSpriteAnchor: PIXI.Point;
	debugContainers: boolean;
	usePixiDisplay: boolean;
	roundFontAlpha: boolean;
	injectMiddleware: boolean;
	roundPixels: boolean;
}

export const Config: ITiledProps = {
	defSpriteAnchor: new Point(0, 1),
	debugContainers: false,
	usePixiDisplay: false,
	roundFontAlpha: false,
	injectMiddleware: true,
	roundPixels: true
};

export const LayerBuildersMap: { [key: string]: ILayerBuilder | undefined } = {};
