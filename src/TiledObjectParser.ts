/// <reference path ="../../node_modules/pixi-layers/dist/pixi-layers.d.ts">

//inject new field in resources
declare module PIXI {
	export interface LoaderResource {
		stage?: TiledOG.TiledContainer;
	}
}

namespace TiledOG {

	let showHello: boolean = true;
	function PrepareOject(layer: any) {

		let props: any = {};
		if (layer.properties) {
			if (layer.properties instanceof Array) {
				for (var p of layer.properties) {
					let val = p.value;
					if (p.type == "color") val = Tiled.Utils.HexStringToHexInt(val);

					props[p.name] = val;
				}
			} else {
				props = layer.properties;
			}
		}

		// http://doc.mapeditor.org/en/stable/reference/tmx-map-format/#tile-flipping
		if(layer.gid) {
			
			const gid = layer.gid;
			const vFlip = gid & 0x40000000;
			const hFlip = gid & 0x80000000;
			const dFlip = gid & 0x20000000;

			props["vFlip"] = vFlip;
			props["hFlip"] = hFlip;
			props["dFlip"] = dFlip;

			const realGid = gid & (~ (0x40000000 | 0x80000000 | 0x20000000));
			layer.gid = realGid;
		}
		
		layer.properties = props;

	}

	function ImageFromTileset(tilesets: any[], baseUrl: string, gid: number) {
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
		
		let find = (tileSet.tiles as Array<{id:number, image: string}>).filter( (obj) => obj.id == realGid)[0];
		
		let img = Object.assign({}, find);
		if (!img) {
			console.log("Load res MISSED gid:" + realGid);
			return null;
		}

		img.image = baseUrl + img.image;

		return img;
	}

	export function CreateStage(
		res: PIXI.LoaderResource | PIXI.Spritesheet | Tiled.MultiSpritesheet,
		loader: any
	): TiledOG.TiledContainer | undefined {
		let _data: any = {};

		if (res instanceof PIXI.LoaderResource) {
			_data = res.data;
		} else {
			_data = loader;
		}

		if (!_data || _data.type != "map") {
			//next();
			return undefined;
		}

		if (showHello) {
			console.log("Tiled OG importer!\n eXponenta {rondo.devil[a]gmail.com}");
			showHello = false;
		}

		const useDisplay: boolean =
			Config.usePixiDisplay != undefined && Config.usePixiDisplay && (PIXI as any).display != undefined;

		let Layer = useDisplay ? (PIXI as any).display.Layer : {};
		let Group = useDisplay ? (PIXI as any).display.Group : {};
		let Stage = useDisplay ? (PIXI as any).display.Stage : {};

		const _stage = new TiledContainer(); //useDisplay ?  new Stage() : new TiledContainer();

		const cropName = new RegExp(/^.*[\\\/]/);

		_stage.layerHeight = _data.height;
		_stage.layerWidth = _data.width;

		let baseUrl = "";

		if (res instanceof PIXI.LoaderResource) 
		{
			_stage.name = res.url.replace(cropName,"").split(".")[0];

			baseUrl = res.url.replace(loader.baseUrl, "");
			baseUrl = baseUrl.match(cropName)![0];
		}

		if (_data.layers) {
			let zOrder = 0; //_data.layers.length;

			if (useDisplay) _data.layers = _data.layers.reverse();

			for (let layer of _data.layers) {
				if (layer.type !== "objectgroup" && layer.type !== "imagelayer") {
					console.warn("OGParser support only OBJECT or IMAGE layes!!");
					continue;
				}

				PrepareOject(layer);
				const props = layer.properties;

				if (props.ignore || props.ignoreLoad) {
					console.log("OGParser: ignore loading layer:" + layer.name);
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
							gid: 123456789,
							name: layer.name,
							x: layer.x + layer.offsetx,
							y: layer.y + layer.offsety,
							fromImageLayer: true,
							properties: layer.properties
						}
					];
				}

				if (!layer.objects) return undefined;
				//next();

				let localZIndex = 0;
				for (let layerObj of layer.objects) {
					PrepareOject(layerObj);

					if (layerObj.properties.ignore) continue;

					const type = Tiled.Utils.Objectype(layerObj);
					let pixiObject = null;
					switch (type) {
						case Tiled.Utils.TiledObjectType.IMAGE: {
							if (!layerObj.fromImageLayer) {
								const img = ImageFromTileset(_data.tilesets, baseUrl, layerObj.gid);
								if (!img) {
									continue;
								}
								layerObj.img = img;
							}

							//Sprite Loader
							pixiObject = SpriteBuilder.Build(layerObj);

							let sprite: PIXI.Sprite = pixiObject as PIXI.Sprite;

							let cached: PIXI.Texture | PIXI.LoaderResource | undefined = undefined;

							if (loader instanceof PIXI.Loader) {
								cached = loader.resources[layerObj.img.image];
							} else if (res instanceof PIXI.Spritesheet) {
								cached = res.textures[layerObj.img.image];
							}

							if (!cached) {
								if (loader instanceof PIXI.Loader) {
									
									loader.add(
										layerObj.img.image,
										{
											parentResource: res
										},
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
								if (cached instanceof PIXI.LoaderResource) {
									if (!cached.isComplete) {
										cached.onAfterMiddleware.once((e:any) => {
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
								} else if (cached as PIXI.Texture) {
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
						case Tiled.Utils.TiledObjectType.TEXT: {
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


	export let Parser = {
		
		Parse(res: PIXI.LoaderResource, next: Function) {
			//@ts-ignore
			var stage = CreateStage(res, this as any);
			res.stage = stage;
			next();
		},

		use(res: PIXI.LoaderResource, next: Function) {
		 	Parser.Parse.call(this, res, next);
		},

		add() {
			console.log("Now you use Tiled!");
		}

	}
}
