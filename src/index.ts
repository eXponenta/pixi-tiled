declare global {
	interface Window {PIXI: any}
}

import * as ContainerBuilder from "./ContainerBuilder";
import * as SpriteBuilder from "./SpriteBuilder";
import * as TextBuilder from "./TextBuilder";
import { Parser, CreateStage } from './TiledObjectParser';
import { Config, ITiledProps } from './Config';
import { TiledContainer } from './TiledContainer';
import Mixin from "./pixi-utils";

export let Builders: Array<Function> = [
	ContainerBuilder.Build,
	SpriteBuilder.Build,
	TextBuilder.Build
];

export function Inject(pixiPack = window.PIXI, props: ITiledProps | undefined = undefined) {
	// @ts-ignore
	if (!pixiPack) {
		console.warn("Auto injection works only with globals scoped PIXI, not in modules\nuse \'Loader.registerPlugin(Parser)\' otherwith");
		return;
	}

	if (props) {
		Object.assign(Config, props)
	}

	Mixin(pixiPack);
	
	if(Config.injectMiddleware){
		pixiPack.Loader.registerPlugin(Parser);
	}
}

import * as Primitives from "./TiledPrimitives"
import MultiSpritesheet from './TiledMultiSheet';
export { Primitives }

export {
	Parser,
	CreateStage,
	Config,
	ContainerBuilder,
	SpriteBuilder,
	TextBuilder,
	TiledContainer,
	MultiSpritesheet
}

