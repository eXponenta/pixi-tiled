import { Container, Text } from "pixi.js"
import { ITiledPtimitive } from './TiledPrimitives';
import { IParsedProps, ITiledLayer, ITiledObject, ITiledFrame, ITiledMap } from "./../ITiledMap";

export class TiledContainer extends Container {
	layerHeight: number = 0;
	layerWidth: number = 0;
	text?: Text;
	primitive?: ITiledPtimitive;
	tiledId?: number;
	properties?: IParsedProps;
	layers?: {[key: string]: Container};
	source?: ITiledLayer | ITiledObject | ITiledMap;
	tileFrame?: ITiledFrame;
}
