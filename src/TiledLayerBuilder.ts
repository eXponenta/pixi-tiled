import { ITiledLayer, ITiledTileLayer, ITiledMap, ITiledTile } from './ITiledMap';
import { TilesetManager } from './TilesetManagers';
import { LayerBuilder } from './LayerBuilder';
import { TiledMapContainer } from './TiledMapContainer';
import { TiledSprite } from './TiledSprite';
import { Config } from './Config';
import { TiledContainer } from './index';
import { TileAnimator } from './TiledAnimator';

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

		const genTile = (x: number, y: number, gid: number)=>{
			const tile = set.getTileByGid(gid);

			const s = new TiledSprite(tile!);
			
			s.x = x * tilewidth;
			s.y = y * tileheight;
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
