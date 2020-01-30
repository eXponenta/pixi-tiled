declare global {
	interface Window {
		PIXI: any;
	}
}

import * as ContainerBuilder from "./ContainerBuilder";
import * as SpriteBuilder from "./SpriteBuilder";
import * as TextBuilder from "./TextBuilder";
import { Parser, CreateStage } from "./TiledObjectParser";
import { Config, ITiledProps } from "./Config";
import { TiledContainer } from "./TiledContainer";
import { InjectMixins } from "./pixi-utils";

export const Builders: Array<(meta: any) => any> = [
	ContainerBuilder.Build,
	SpriteBuilder.Build,
	TextBuilder.Build
];

export function Inject(
	pixiPack = window.PIXI,
	props: ITiledProps | undefined = undefined
) {
	// @ts-ignore
	if (!pixiPack) {
		console.warn(
			"Auto injection works only with globals scoped PIXI, not in modules\nuse 'Loader.registerPlugin(Parser)' otherwith"
		);
		return;
	}

	if (props) {
		Object.assign(Config, props);
	}

	InjectMixins(pixiPack);

	if (Config.injectMiddleware) {
		pixiPack.Loader.registerPlugin(Parser);
	}
}

import * as Primitives from "./TiledPrimitives";
import MultiSpritesheet from "./TiledMultiSheet";

export { Primitives };
export { Parser };
export { CreateStage };
export { Config };
export { ContainerBuilder };
export { SpriteBuilder };
export { TextBuilder };
export { TiledContainer };
export { MultiSpritesheet };
