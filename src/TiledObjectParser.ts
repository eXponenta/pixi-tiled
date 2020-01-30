import { Spritesheet, LoaderResource, Sprite, Loader, Texture } from "pixi.js";
import { TiledContainer } from "./TiledContainer";
import { Config, LayerBuildersMap } from "./Config";
import * as Utils from "./Utils";
import * as ContainerBuilder from "./ContainerBuilder";
import * as TextBuilder from "./TextBuilder";
import * as SpriteBuilder from "./SpriteBuilder";
import * as LayerBuilder from "./LayerBuilder";

import MultiSpritesheet from "./TiledMultiSheet";
import {
	ITiledObjectLayer,
	ITiledObject,
	ITiledSprite,
	ITiledMap,
	ITiledImageLayer
} from "./ITiledMap";

//inject new field in resources
declare module "pixi.js" {
	export interface LoaderResource {
		stage?: TiledContainer;
	}
}

let showHello: boolean = true;

export function CreateStage(
	res: LoaderResource | Spritesheet | MultiSpritesheet,
	loader: any
): TiledContainer | undefined {
	let _data: ITiledMap;

	if (res instanceof LoaderResource) {
		_data = res.data;
	} else {
		_data = loader;
	}

	//validate
	if (!_data || _data.type != "map") {
		//next();
		return undefined;
	}

	if (showHello) {
		console.log("[TILED] Importer!\neXponenta {rondo.devil[a]gmail.com}");
		showHello = false;
	}

	const useDisplay: boolean =
		!!Config.usePixiDisplay && (PIXI as any).display !== undefined;

	const stage = new TiledContainer();
	const cropName = new RegExp(/^.*[\\\/]/);

	stage.layerHeight = _data.height;
	stage.layerWidth = _data.width;

	let baseUrl = "";

	if (res instanceof LoaderResource) {
		stage.name = res.url.replace(cropName, "").split(".")[0];
		baseUrl = res.url.replace(loader.baseUrl, "");
		baseUrl = baseUrl.match(cropName)![0];
	}

	if (_data.layers) {
		let zOrder = 0; //_data.layers.length;

		if (useDisplay) {
			_data.layers = _data.layers.reverse();
		}

		for (let layer of _data.layers) {

			const builder = LayerBuildersMap[layer.type];
			if (!builder) {
				console.warn(
					`[TILED] Importer can't support ${layer.type} layer type!`
				);
				continue;
			}

			const pixiLayer = builder.Build(layer, zOrder);

			if(!pixiLayer) {
				continue;
			}

			zOrder++;
			stage.layers = {
				[layer.name]: pixiLayer
			};

			stage.addChild(pixiLayer);

			if (layer.type == "imagelayer") {
				(layer as ITiledObjectLayer).objects = [
					{
						image: {
							image: baseUrl + (layer as ITiledImageLayer).image
						},
						//imageLayer can't has gid ID

						gid: -1,
						name: layer.name,
						x: layer.x + layer.offsetx,
						y: layer.y + layer.offsety,

						fromImageLayer: true,
						properties: layer.properties,
						parsedProps: layer.parsedProps
					} as ITiledSprite
				];
			}

			const objects = (layer as ITiledObjectLayer)
				.objects as ITiledObject[];

			if (!objects) {
				continue;
			}

			let localZIndex = 0;

			for (let layerObj of objects) {
				Utils._prepareProperties(layerObj);

				if (layerObj.parsedProps.ignore) {
					continue;
				}

				const type = Utils.Objectype(layerObj);

				let pixiObject = null;

				switch (type) {
					case Utils.TiledObjectType.IMAGE: {
						const spriteObj = layerObj as ITiledSprite;

						if (!spriteObj.fromImageLayer) {
							const img = Utils.resolveImageUrl(
								_data.tilesets,
								baseUrl,
								layerObj.gid
							);

							if (!img) {
								continue;
							}

							spriteObj.image = img;
						}

						//Sprite Loader
						pixiObject = SpriteBuilder.Build(spriteObj);

						const sprite: Sprite = pixiObject;

						let cached:
							| Texture
							| LoaderResource
							| undefined = undefined;

						if (loader instanceof Loader) {
							cached = loader.resources[spriteObj.image!.image!];
						} else if (res.textures) {
							cached = res.textures[spriteObj.image!.image!];
						}

						if (!cached) {
							if (loader instanceof Loader) {
								loader.add(
									spriteObj.image!.image,
									Object.assign(
										(res as LoaderResource).metadata,
										{
											parentResource: res,
											crossOrigin: (res as LoaderResource)
												.crossOrigin
										}
									),
									() => {
										const tex =
											loader.resources[
												spriteObj.image!.image!
											].texture;
										sprite.texture = tex;
										if (spriteObj.fromImageLayer) {
											sprite.scale.set(1);
										}
									}
								);
							} else {
								continue;
							}
						} else {
							if (cached instanceof LoaderResource) {
								if (!cached.isComplete) {
									(cached as any).onAfterMiddleware.once(
										(e: any) => {
											sprite.texture = (cached as any).texture;
											if (spriteObj.fromImageLayer) {
												sprite.scale.set(1);
											}
										}
									);
								} else {
									sprite.texture = cached.texture;
									if (spriteObj.fromImageLayer) {
										sprite.scale.set(1);
									}
								}
							} else if (cached as Texture) {
								sprite.texture = cached as any;
								//sprite.height = (cached as any).height;
								//sprite.width = (cached as any).width;
								if (spriteObj.fromImageLayer) {
									sprite.scale.set(1);
								}
							}
						}

						break;
					}

					// TextLoader
					case Utils.TiledObjectType.TEXT: {
						pixiObject = TextBuilder.Build(layerObj);
						break;
					}

					default: {
						pixiObject = ContainerBuilder.Build(layerObj);
					}
				}

				if (Config.usePixiDisplay) {
					(pixiObject as any).parentGroup = (pixiLayer as any).group;
					stage.addChildAt(pixiObject, localZIndex);
				} else {
					pixiLayer.addChildAt(pixiObject, localZIndex);
				}

				localZIndex++;
			}
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
		console.log("Congratulations! Now you use Tiled importer!");
	}
};
