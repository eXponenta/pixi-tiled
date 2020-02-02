import { Spritesheet, LoaderResource, ITextureDictionary, Loader } from 'pixi.js';
import { TiledContainer } from '../objects/TiledContainer';
import { Config, LayerBuildersMap } from '../Config';

import { MultiSpritesheet } from './TiledMultiSheet';
import { ITiledMap } from '../ITiledMap';
import { TilesetManager } from './TilesetManagers';
import { TiledMapContainer } from '../objects/TiledMapContainer';

//inject new field in resources
declare module 'pixi.js' {
	export interface LoaderResource {
		stage?: TiledContainer;
	}
}

type tValidSheet = Spritesheet | MultiSpritesheet | ITextureDictionary;
let showHello: boolean = true;

export function CreateStage(
	sheet: tValidSheet | undefined,
	_data: ITiledMap,
	baseUrl: string = '',
): TiledMapContainer | undefined {
	//validate
	if (!_data || _data.type != 'map') {
		return undefined;
	}

	if (showHello) {
		console.log('[TILED] Importer!\neXponenta {rondo.devil[a]gmail.com}');
		showHello = false;
	}

	const useDisplay: boolean = !!Config.usePixiDisplay && (PIXI as any).display !== undefined;
	const stage = new TiledMapContainer();

	stage.layerHeight = _data.height;
	stage.layerWidth = _data.width;
	stage.source = _data;

	stage.tileSet = new TilesetManager(_data.tilesets, sheet);
	stage.tileSet.baseUrl = baseUrl;

	if (_data.layers) {
		let zOrder = 0; //_data.layers.length;

		if (useDisplay) {
			_data.layers = _data.layers.reverse();
		}

		for (let layer of _data.layers) {
			const builder = LayerBuildersMap[layer.type];

			if (!builder) {
				console.warn(`[TILED] Importer can't support ${layer.type} layer type!`);
				continue;
			}

			const pixiLayer = builder.Build(layer, stage.tileSet, zOrder, stage);

			if (!pixiLayer) {
				continue;
			}

			zOrder++;
			stage.layers = {
				[layer.name]: pixiLayer,
			};

			stage.addChild(pixiLayer);
		}
	}

	return stage;
}

export const Parser = {
	Parse(res: LoaderResource, next: Function) {
		const data = res.data;
		const cropName = new RegExp(/^.*[\\\/]/);

		let baseUrl = res.url.replace((this as any).baseUrl, '');
		baseUrl = baseUrl.match(cropName)![0];

		const stage = CreateStage(res.textures!, data, baseUrl);

		if (!stage) {
			next();
			return;
		}

		stage.name = res.url.replace(cropName, '').split('.')[0];
		res.stage = stage;

		if (stage.tileSet!.loaded) {
			next();
			return;
		}

		stage.tileSet!.once('loaded', () => next());
	},

	use(res: LoaderResource, next: Function) {
		Parser.Parse.call(this, res, next);
	},

	add() {
		console.log('[TILED] middleware registered!');
	},
};
