declare global {
	interface Window {
		PIXI: any;
	}
}

const VERSION = '__VERSION__';

import * as ContainerBuilder from './builders/ContainerBuilder';
import * as SpriteBuilder from './builders/SpriteBuilder';
import * as TextBuilder from './builders/TextBuilder';

import { TiledMapAsset, CreateStage } from './tools/TiledObjectParser';
import { Config, ITiledProps, LayerBuildersMap } from './Config';
import { TiledContainer } from './objects/TiledContainer';
import { InjectMixins } from './pixi-utils';
import { extensions } from '@pixi/core';

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
}

import * as Primitives from './objects/TiledPrimitives';
import { MultiSpritesheet } from './tools/TiledMultiSheet';
import { ObjectLayerBuilder } from './layers/ObjectsLayerBuilder';
import { TiledLayerBuilder } from './layers/TiledLayerBuilder';
export { Primitives };
export { TiledMapAsset };
export { CreateStage };
export { Config };
export { ContainerBuilder };
export { SpriteBuilder };
export { TextBuilder };
export { TiledContainer };
export { MultiSpritesheet };
export { VERSION };
export { LayerBuildersMap};
export { ObjectLayerBuilder};
export * from './ITiledMap';