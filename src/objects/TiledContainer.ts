import type { Text } from '@pixi/text';
import { Container } from '@pixi/display';
import type { ITiledPtimitive } from './TiledPrimitives';
import type { Rectangle } from '@pixi/math'
import type { IParsedProps, ITiledLayer, ITiledObject, ITiledFrame, ITiledMap } from './../ITiledMap';

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
	name?: string;
	types?: string[];
	hitArea?: Rectangle;
}
