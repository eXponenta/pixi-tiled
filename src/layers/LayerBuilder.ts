import { ITiledLayer } from '../ITiledMap';
import { _prepareProperties, ApplyMeta } from '../tools/Utils';
import { TiledContainer} from './../objects/TiledContainer';
import { TilesetManager } from '../tools/TilesetManagers';

export interface ILayerBuilder {
	Build(meta: ITiledLayer, tileset: TilesetManager, ...args: any[]): TiledContainer | undefined;
};

export const LayerBuilder = {
	Build(layer: ITiledLayer, tileset: TilesetManager, zOrder = 0): TiledContainer | undefined {
		_prepareProperties(layer);

		const props = layer.parsedProps;

		if (props.ignore || props.ignoreLoad) {
			console.log('[TILED] layer ignored:' + layer.name);
			return undefined;
		}

		const layerObject: TiledContainer = new TiledContainer();

		layerObject.tiledId = layer.id;
		layerObject.name = layer.name;
		layerObject.visible = layer.visible;

		layerObject.position.set(layer.x, layer.y);
		layerObject.alpha = layer.opacity || 1;

		ApplyMeta(layer, layerObject);
		return layerObject;
	},
};
