import { Spritesheet } from '@pixi/spritesheet';
import { ILoaderResource, Loader } from '@pixi/loaders';
import { TiledContainer } from '../objects/TiledContainer';
import { Config, LayerBuildersMap } from '../Config';

import { MultiSpritesheet } from './TiledMultiSheet';
import { ITiledMap } from '../ITiledMap';
import { TilesetManager } from './TilesetManagers';
import { TiledMapContainer } from '../objects/TiledMapContainer';
import { EventEmitter } from '@pixi/utils';
import { utils, ExtensionType, extensions } from '@pixi/core';
import { LoaderParserPriority, LoadAsset, LoaderParser, AssetExtension, Assets } from '@pixi/assets';

//inject new field in resources
declare module GlobalMixins {
	export interface ILoaderResource {
		stage?: TiledContainer;
	}
}

type tValidSheet = Spritesheet | MultiSpritesheet;
let showHello: boolean = true;

let TilesetCache: { [index: string]: any } = {};

export function CreateStage(
	sheet: tValidSheet | undefined,
	_data: ITiledMap,
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
	stage.tileSet.baseUrl = _data.baseUrl;

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
const cropName = new RegExp(/^.*[\\\/]/);

const TiledMapAsset = {
	extension: ExtensionType.Asset,
	detection: {
		test: async() =>  { return true;},
		add: async (formats:any) => { return [...formats, "json"]; },
		remove: async (formats:any) => { return formats.filter((ext:any) => ext == "json")}
	},
	loader: {
		extension: {
			type: ExtensionType.LoadParser,
			priority: LoaderParserPriority.Low
		},
		testParse(asset: any, loadAsset?: LoadAsset, loader?: Loader): Promise<boolean>
		{
			return new Promise((resolve, reject) => {
				if (asset && asset.type == 'map')
				{
					resolve(true);
				}
				else
				{
					resolve(false);
				}
			});
		},
		parse(map: ITiledMap, loadedAsset: any, loader?: Loader): Promise<ITiledMap>
		{
			return new Promise((resolve, reject) => {	
				let baseUrl = loadedAsset.src.replace((this as any).baseUrl, '');
				baseUrl = baseUrl.match(cropName)![0];
				map.baseUrl = baseUrl;

				const tilesetsToLoad = [];
				for (let  tilesetIndex = 0; tilesetIndex < map.tilesets.length; tilesetIndex++)
				{
					const tileset = map.tilesets[tilesetIndex];
					if (tileset.source !== undefined)
					{
						let cachedTileset = TilesetCache[tileset.source];
						if (cachedTileset)
						{
							map.tilesets[tilesetIndex] = cachedTileset;
						}
						else 
						{
							tilesetsToLoad.push(tileset);
							TilesetCache[tileset.source] = tileset;
						}
					}
				}			
				if (tilesetsToLoad.length == 0)
				{
					resolve(map as ITiledMap);
				}
				else
				{
					let  tilesetsList = [];
					for (let tilesetIndex = 0; tilesetIndex < tilesetsToLoad.length; tilesetIndex++)
					{
						let tileset = tilesetsToLoad[tilesetIndex];
						if (tileset.source !== undefined)
						{
							let name = utils.path.basename(tileset.source);
							tilesetsList.push(name);
							Assets.add(name, baseUrl + tilesetsToLoad[tilesetIndex].source);
						}
					}
					Assets.load(tilesetsList).then((resources)=>{
						Object.keys(resources).forEach(resourcePath => {
							let tilesetResource = resources[resourcePath];
							let resourceFileName =  resourcePath.replace(cropName, '');
							for (let  tilesetIndex = 0; tilesetIndex < map.tilesets.length; tilesetIndex++)
							{
								const tileset = map.tilesets[tilesetIndex];
								if (tileset.source === resourceFileName)
								{
									Object.assign(tileset, tilesetResource);
								}
							} 
						});
						resolve(map as ITiledMap);
					});
				}
			});
		},
	} as LoaderParser<ITiledMap>
} as AssetExtension;

extensions.add(TiledMapAsset);

export { TiledMapAsset };
