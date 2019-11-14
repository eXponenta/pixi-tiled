import { Spritesheet, LoaderResource, Sprite, Loader, Texture } from 'pixi.js';
import { TiledContainer } from './TiledContainer';
import { Config } from './Config';
import * as Utils from "./Utils";
import * as ContainerBuilder from "./ContainerBuilder";
import * as TextBuilder from  "./TextBuilder";
import * as SpriteBuilder from "./SpriteBuilder";

import MultiSpritesheet from './TiledMultiSheet';

//inject new field in resources
declare module "pixi.js" {
	export interface LoaderResource {
		stage?: TiledContainer;
	}
}

let showHello: boolean = true;
function _prepareProperties(layer: any) {

	let props: any = {};
	if (layer.properties) {
		if (layer.properties instanceof Array) {
			for (var p of layer.properties) {
				let val = p.value;
				if (p.type == "color") {
					val = Utils.HexStringToHexInt(val);
				}
				props[p.name] = val;
			}
		} else {
			props = layer.properties;
		}
	}

	// http://doc.mapeditor.org/en/stable/reference/tmx-map-format/#tile-flipping
	if (layer.gid) {

		const gid = layer.gid;
		const vFlip = gid & 0x40000000;
		const hFlip = gid & 0x80000000;
		const dFlip = gid & 0x20000000;

		props["vFlip"] = vFlip;
		props["hFlip"] = hFlip;
		props["dFlip"] = dFlip;

		const realGid = gid & (~(0x40000000 | 0x80000000 | 0x20000000));
		layer.gid = realGid;
	}

	layer.properties = props;

}

function _getImageFromTileset(tilesets: any[], baseUrl: string, gid: number) {
	var tileSet = undefined; //_data.tilesets[0];
	for (let i = 0; i < tilesets.length; i++) {
		if (tilesets[i].firstgid <= gid) {
			tileSet = tilesets[i];
		}
	}

	if (!tileSet) {
		console.log("Image with gid:" + gid + " not found!");
		return null;
	}

	const realGid = gid - tileSet.firstgid;

	let find = (tileSet.tiles as Array<{ id: number, image: string }>).filter((obj) => obj.id == realGid)[0];

	let img = Object.assign({}, find);
	if (!img) {
		console.log("Load res MISSED gid:" + realGid);
		return null;
	}

	img.image = baseUrl + img.image;

	return img;
}

export function CreateStage(
	res: LoaderResource | Spritesheet | MultiSpritesheet,
	loader: any
): TiledContainer | undefined {
	let _data: any = {};

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

	const useDisplay: boolean = !!Config.usePixiDisplay && (PIXI as any).display !== undefined;

	let Layer = useDisplay ? (PIXI as any).display.Layer : {};
	let Group = useDisplay ? (PIXI as any).display.Group : {};
	let Stage = useDisplay ? (PIXI as any).display.Stage : {};

	const _stage = new TiledContainer(); //useDisplay ?  new Stage() : new TiledContainer();

	const cropName = new RegExp(/^.*[\\\/]/);

	_stage.layerHeight = _data.height;
	_stage.layerWidth = _data.width;

	let baseUrl = "";

	if (res instanceof LoaderResource) {
		_stage.name = res.url.replace(cropName, "").split(".")[0];
		baseUrl = res.url.replace(loader.baseUrl, "");
		baseUrl = baseUrl.match(cropName)![0];
	}

	if (_data.layers) {
		let zOrder = 0; //_data.layers.length;

		if (useDisplay) {
			_data.layers = _data.layers.reverse();
		}

		for (let layer of _data.layers) {
			if (layer.type !== "objectgroup" && layer.type !== "imagelayer") {
				console.warn("[TILED] Importer support only OBJECT or IMAGE layers yet!");
				continue;
			}

			_prepareProperties(layer);
			const props = layer.properties;

			if (props.ignore || props.ignoreLoad) {
				console.log("[TILED] layer ignored:" + layer.name);
				continue;
			}

			const pixiLayer = useDisplay
				? new Layer(new Group(props.zOrder !== undefined ? props.zOrder : zOrder, true))
				: new TiledContainer();

			zOrder++;

			pixiLayer.tiledId = layer.id;

			pixiLayer.name = layer.name;
			(_stage as any).layers = {};
			(_stage as any).layers[layer.name] = pixiLayer;
			pixiLayer.visible = layer.visible;

			pixiLayer.position.set(layer.x, layer.y);
			pixiLayer.alpha = layer.opacity || 1;

			ContainerBuilder.ApplyMeta(layer, pixiLayer);

			_stage.addChild(pixiLayer);

			if (layer.type == "imagelayer") {
				layer.objects = [
					{
						img: {
							image: baseUrl + layer.image
						},
						//imageLayer can't has gid ID
						gid: -1,
						name: layer.name,
						x: layer.x + layer.offsetx,
						y: layer.y + layer.offsety,
						fromImageLayer: true,
						properties: layer.properties
					}
				];
			}

			if (!layer.objects) {
				return undefined;
			}

			let localZIndex = 0;
			for (let layerObj of layer.objects) {
				_prepareProperties(layerObj);

				if (layerObj.properties.ignore) {
					continue;
				}

				const type = Utils.Objectype(layerObj);
				let pixiObject = null;
				switch (type) {
					case Utils.TiledObjectType.IMAGE: {
						if (!layerObj.fromImageLayer) {
							const img = _getImageFromTileset(_data.tilesets, baseUrl, layerObj.gid);
							if (!img) {
								continue;
							}
							layerObj.img = img;
						}

						//Sprite Loader
						pixiObject = SpriteBuilder.Build(layerObj);

						let sprite: Sprite = pixiObject as Sprite;

						let cached: Texture | LoaderResource | undefined = undefined;

						if (loader instanceof Loader) {
							cached = loader.resources[layerObj.img.image];
						} else if ( res.textures ) {
							cached = res.textures[layerObj.img.image];
						}

						if (!cached) {
							if (loader instanceof Loader) {

								loader.add(
									layerObj.img.image,
									Object.assign(
									(res as LoaderResource).metadata,
									{
										parentResource: res,
										crossOrigin: (res as LoaderResource).crossOrigin
									}),
									() => {
										const tex = loader.resources[layerObj.img.image].texture;
										sprite.texture = tex;
										if (layerObj.fromImageLayer) {
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
									(cached as any).onAfterMiddleware.once((e: any) => {
										sprite.texture = (cached as any).texture;
										if (layerObj.fromImageLayer) {
											sprite.scale.set(1);
										}
									})
								} else {
									sprite.texture = cached.texture;
									if (layerObj.fromImageLayer) {
										sprite.scale.set(1);
									}
								}
							} else if (cached as Texture) {
								sprite.texture = cached as any;
								//sprite.height = (cached as any).height;
								//sprite.width = (cached as any).width;
								if (layerObj.fromImageLayer) {
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
					(pixiObject as any).parentGroup = pixiLayer.group;
					_stage.addChildAt(pixiObject, localZIndex);
				} else {
					pixiLayer.addChildAt(pixiObject, localZIndex);
				}

				localZIndex++;
			}
		}
	}

	return _stage;
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

}