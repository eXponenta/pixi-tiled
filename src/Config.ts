import { Point } from "@pixi/math";
import { ILayerBuilder } from "./layers/LayerBuilder";

export interface ITiledProps {
	defSpriteAnchor: Point;
	debugContainers: boolean;
	usePixiDisplay: boolean;
	roundFontAlpha: boolean;
	injectMiddleware: boolean;
	roundPixels: boolean;
	autoCreateStage: boolean;
}

export const Config: ITiledProps = {
	defSpriteAnchor: new Point(0, 1),
	debugContainers: false,
	usePixiDisplay: false,
	roundFontAlpha: false,
	injectMiddleware: true,
	roundPixels: true,
	autoCreateStage: true
};

export const LayerBuildersMap: { [key: string]: ILayerBuilder | undefined } = {};
