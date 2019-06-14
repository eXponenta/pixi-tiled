import { Container, Text } from "pixi.js"
import { ITiledPtimitive } from './TiledPrimitives';

export class TiledContainer extends Container {
	layerHeight: number = 0;
	layerWidth: number = 0;
	text?: Text;
	primitive?: ITiledPtimitive;
	tiledId?: number
}
