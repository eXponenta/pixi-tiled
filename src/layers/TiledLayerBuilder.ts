import { ITiledLayer, ITiledTileLayer, ITiledMap, ITiledTile, ITiledSprite } from '../ITiledMap';
import { TilesetManager } from '../tools/TilesetManagers';
import { LayerBuilder } from './LayerBuilder';
import { TiledMapContainer } from '../objects/TiledMapContainer';
import { TiledSprite } from '../objects/TiledSprite';
import { Config } from '../Config';
import { TiledContainer } from '../index';
import { TileAnimator } from '../objects/TiledAnimator';

export const TiledLayerBuilder = {
	Build(layer: ITiledLayer, set: TilesetManager, zOrder: number = 0, tileMap: TiledMapContainer) {
		const tiledLayer = layer as ITiledTileLayer;
		const tileMapSource: ITiledMap = tileMap.source! as ITiledMap;
		const layerContatiner = LayerBuilder.Build(layer, set, zOrder) as TiledContainer & {animators: Map<string, TileAnimator> };

		if(!layerContatiner) {
			return undefined;
		}

		const data = this.__decodeData(tiledLayer);
		const { width, height } = layer;
		const { tileheight, tilewidth } = tileMapSource;

		var xWeights = {
			x: 0,
			y: 0
		};
		var yWeights = {
			x: 0,
			y: 0
		};
		var mapOrientationShift = {
			x: 0,
			y: 0
		};
		switch (tileMapSource.orientation)
		{
			case "orthogonal":
				xWeights.x = tilewidth;
				yWeights.y = tileheight;
				break;
			case "isometric":
				xWeights.x = tilewidth / 2;
				xWeights.y = -tilewidth / 2;
				yWeights.x = tileheight / 2;
				yWeights.y = tileheight / 2;
				mapOrientationShift.x = (height - 1) * xWeights.x;
				mapOrientationShift.y = -tileheight/2;
				break;
		}

		const genTile = (x: number, y: number, gid: number)=>{
			const tile = set.getTileByGid(gid);

			const s = new TiledSprite({
				image: tile,
				fromImageLayer: false,
				gid: gid,
				anchor: {x: 0, y: 0}
			} as ITiledSprite);
			
			s.x = x * xWeights.x + y * xWeights.y + mapOrientationShift.x;
			s.y = x * yWeights.x + y * yWeights.y + mapOrientationShift.y - (tile!.imageheight === undefined ? 0 : tile!.imageheight - tileheight);
			s.roundPixels = Config.roundPixels;

			if(tile && tile.animation) {
				const animators = layerContatiner.animators || new Map();
				const animId = tile.tilesetId + "_" + tile.id;

				let animator = animators.get(animId);
				if(!animator) {
					animator = new TileAnimator(tile);
					animators.set(animId, animator);
				}

				s.anim = animator;
				animator.anim.play();
			}

			return s;
		}

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const index = x + y * width;
				const gid = data[index];

				// skip gid 0,
				if(!gid) {
					continue;
				}

				layerContatiner.addChild(genTile(x,y,data[index]));
			}
		}

		return layerContatiner;
	},

	__decodeData(layer: ITiledTileLayer): number[] {
		return layer.data;
	},
};
