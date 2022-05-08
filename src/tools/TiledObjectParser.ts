import { Spritesheet } from '@pixi/spritesheet';
import { ILoaderResource, Loader } from '@pixi/loaders';
import { TiledContainer } from '../objects/TiledContainer';
import { Config, LayerBuildersMap } from '../Config';

import { MultiSpritesheet } from './TiledMultiSheet';
import { ITiledMap } from '../ITiledMap';
import { TilesetManager } from './TilesetManagers';
import { TiledMapContainer } from '../objects/TiledMapContainer';

//inject new field in resources
declare module GlobalMixins {
	export interface ILoaderResource {
		stage?: TiledContainer;
	}
}

type tValidSheet = Spritesheet | MultiSpritesheet;
let showHello: boolean = true;

export function CreateStage(
	sheet: tValidSheet | undefined,
	_data: ITiledMap,
	baseUrl: string = '',
): TiledMapContainer | undefined {

	if (showHello) {
		console.log('[TILED] Importer!\neXponenta {rondo.devil[a]gmail.com}');
		showHello = false;
	}

	const useDisplay: boolean = false;
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
	Parse(res: ILoaderResource, next: Function) {
		const data = res.data;
		//validate
		if (!data || data.type != 'map') {
			next();
			return;
		}

		const cropName = new RegExp(/^.*[\\\/]/);
		let baseUrl = res.url.replace((this as any).baseUrl, '');
		baseUrl = baseUrl.match(cropName)![0];

		const tilesetsToLoad = [];
		for (let  tilesetIndex = 0; tilesetIndex < data.tilesets.length; tilesetIndex++)
		{
			const tileset = data.tilesets[tilesetIndex];
			if (tileset.source !== undefined)
			{
				tilesetsToLoad.push(tileset);
			}
		}

		const _tryCreateStage = function()
		{
			if (!Config.autoCreateStage)
			{
				next();
				return;
			}
			const stage = CreateStage(<any>res.textures!, data, baseUrl);

			if (!stage) {
				next();
				return;
			}

			stage.name = res.url.replace(cropName, '').split('.')[0];
			//@ts-ignore
			res.stage = stage;

			if (stage.tileSet!.loaded) {
				next();
				return;
			}

			stage.tileSet!.once('loaded', () => next());
		}

		if (tilesetsToLoad.length > 0)
		{
			const loader = new Loader();
			for (let tilesetIndex = 0; tilesetIndex < tilesetsToLoad.length; tilesetIndex++)
			{
				loader.add(baseUrl + tilesetsToLoad[tilesetIndex].source);
			}
			loader.load(()=>{
				Object.keys(loader.resources).forEach(resourcePath => {
					let tilesetResource = loader.resources[resourcePath];
					let resourceFileName =  resourcePath.replace(cropName, '');
					for (let  tilesetIndex = 0; tilesetIndex < data.tilesets.length; tilesetIndex++)
					{
						const tileset = data.tilesets[tilesetIndex];
						if (tileset.source === resourceFileName)
						{
							Object.assign(tileset, tilesetResource.data);
						}
					}
				});
				_tryCreateStage();
			});
		}
		else
		{
			_tryCreateStage();
		}
	},

	use(res: ILoaderResource, next: Function) {
		Parser.Parse.call(this, res, next);
	},

	add() {
		console.log('[TILED] middleware registered!');
	},
};
