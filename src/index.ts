declare global {
	interface Window {
		PIXI: any;
	}
}

const VERSION = '__VERSION__';

import * as ContainerBuilder from './ContainerBuilder';
import * as SpriteBuilder from './SpriteBuilder';
import * as TextBuilder from './TextBuilder';

import { Parser, CreateStage } from './TiledObjectParser';
import { Config, ITiledProps, LayerBuildersMap } from './Config';
import { TiledContainer } from './TiledContainer';
import { InjectMixins } from './pixi-utils';

// prevent circular
Object.assign(LayerBuildersMap, {
	tilelayer: TiledLayerBuilder,
	objectgroup: ObjectLayerBuilder,
	imagelayer: ObjectLayerBuilder,
	group: undefined,
});

export function Inject(pixiPack = window.PIXI, props: Partial<ITiledProps> | undefined = undefined) {
	if (!pixiPack) {
		console.warn(
			"Auto injection works only with globals scoped PIXI, not in modules\nuse 'Loader.registerPlugin(Parser)' otherwith",
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

import * as Primitives from './TiledPrimitives';
import { MultiSpritesheet } from './TiledMultiSheet';
import { ObjectLayerBuilder } from './ObjectsLayerBuilder';
import { TiledLayerBuilder } from './TiledLayerBuilder';
export { Primitives };
export { Parser };
export { CreateStage };
export { Config };
export { ContainerBuilder };
export { SpriteBuilder };
export { TextBuilder };
export { TiledContainer };
export { MultiSpritesheet };
export { VERSION };
