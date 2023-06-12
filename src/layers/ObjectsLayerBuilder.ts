import { ITiledLayer, ITiledImageLayer, ITiledObjectLayer, ITiledSprite, ITiledObject } from '../ITiledMap';
import { TiledContainer } from '../objects/TiledContainer';
import { LayerBuilder } from './LayerBuilder';
import { TilesetManager } from '../tools/TilesetManagers';
import { _prepareProperties } from '../tools/Utils';

import * as SB from '../builders/SpriteBuilder';
import * as TB from '../builders/TextBuilder';
import * as CB from '../builders/ContainerBuilder';

import { TiledSprite } from '../objects/TiledSprite';
import { TiledObjectType, Objectype } from '../tools/TiledObjectType';

export const ObjectLayerBuilder = {
	__gen: <Record<TiledObjectType, (...args: any[]) => TiledContainer | TiledContainer>>{
		[TiledObjectType.IMAGE](meta: ITiledObject, tileset: TilesetManager) {
			const smeta = meta as ITiledSprite;
			const frame = smeta.image ? tileset.getTileByTile(smeta.image!) : tileset.getTileByGid(smeta.gid);

			smeta.image = frame;

			const sprite = SB.Build(smeta) as TiledSprite;

			if (smeta.fromImageLayer && frame!.lazyLoad) {
				frame!.texture.once('loaded', () => {
					sprite.scale.set(1);
				});
			}

			if (smeta.fromImageLayer) {
				sprite.anchor.set(0);
			}

			return (sprite as any) as TiledContainer;
		},
		[TiledObjectType.TEXT](meta: ITiledObject, tileset: TilesetManager) {
			return TB.Build(meta);
		},
		[TiledObjectType.DEFAULT](meta: ITiledObject, tileset: TilesetManager) {
			return CB.Build(meta);
		},
	},

	Build(layer: ITiledLayer, tileset: TilesetManager, zOrder = 0): TiledContainer | undefined {
		const objLayer = layer as ITiledObjectLayer;
		const layerContatiner = LayerBuilder.Build(layer, tileset, zOrder);

		if (!layerContatiner) {
			return undefined;
		}

		if (layer.type === 'imagelayer') {
			if (!this.__convertLayer(layer as ITiledImageLayer)) {
				return undefined;
			}
		}

		if (!objLayer.objects || !objLayer.objects.length) {
			return layerContatiner;
		}

		const objects = objLayer.objects;

		let localZIndex = 0;

		for (let objMeta of objects) {
			_prepareProperties(objMeta);

			const type = Objectype(objMeta);
			const method = this.__gen[type] || this.__gen[TiledObjectType.DEFAULT];
			const obj = method!.call(this, objMeta, tileset);

			if (!obj) {
				continue;
			}

			/*
			if (Config.usePixiDisplay) {
				(obj as any).parentGroup = (layerContatiner as any).group;
				stage.addChildAt(pixiObject, localZIndex);
			} else {
				*/

			layerContatiner.addChildAt(obj, localZIndex);
			//}

			localZIndex++;
		}

		return layerContatiner;
	},

	__convertLayer(imageLayer: ITiledImageLayer) {
		if (!imageLayer.image) {
			return false;
		}

		(imageLayer as any).objects = [
			{
				image: {
					image: imageLayer.image,
				},
				//imageLayer can't has gid ID

				gid: -1,
				name: imageLayer.name,
				x: imageLayer.x,
				y: imageLayer.y,

				fromImageLayer: true,
				properties: imageLayer.properties,
				parsedProps: imageLayer.parsedProps,
			} as ITiledSprite,
		];
		return true;
	},
};
