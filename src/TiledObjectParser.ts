import { Spritesheet, LoaderResource } from 'pixi.js';
import { TiledContainer } from './TiledContainer';
import { Config, LayerBuildersMap } from './Config';

import { MultiSpritesheet} from './TiledMultiSheet';
import {  ITiledMap } from './ITiledMap';
import { TilesetManager } from './TilesetManagers';

//inject new field in resources
declare module 'pixi.js' {
	export interface LoaderResource {
		stage?: TiledContainer;
	}
}

let showHello: boolean = true;

export function CreateStage(
	res: LoaderResource | Spritesheet | MultiSpritesheet,
	loader: any,
): TiledContainer | undefined {
	let _data: ITiledMap;

	if (res instanceof LoaderResource) {
		_data = res.data;
	} else {
		_data = loader;
	}

	//validate
	if (!_data || _data.type != 'map') {
		//next();
		return undefined;
	}

	if (showHello) {
		console.log('[TILED] Importer!\neXponenta {rondo.devil[a]gmail.com}');
		showHello = false;
	}

	const useDisplay: boolean = !!Config.usePixiDisplay && (PIXI as any).display !== undefined;
	const sheet: MultiSpritesheet | Spritesheet | undefined = res.textures ? (res as any) : undefined;
	const stage = new TiledContainer();
	const cropName = new RegExp(/^.*[\\\/]/);

	stage.layerHeight = _data.height;
	stage.layerWidth = _data.width;
	stage.source = _data;

	let baseUrl = '';

	if (res instanceof LoaderResource) {
		stage.name = res.url.replace(cropName, '').split('.')[0];
		baseUrl = res.url.replace(loader.baseUrl, '');
		baseUrl = baseUrl.match(cropName)![0];
	}

	if (_data.layers) {
		const setManager = new TilesetManager(_data.tilesets, sheet);
		setManager.baseUrl = baseUrl;

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

			const pixiLayer = builder.Build(layer, setManager, zOrder);

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
		//@ts-ignore
		var stage = CreateStage(res, this as any);
		res.stage = stage;
		next();
	},

	use(res: LoaderResource, next: Function) {
		Parser.Parse.call(this, res, next);
	},

	add() {
		console.log('[TILED] middleware registered!');
	},
};
