import { ITiledLayer } from '../ITiledMap';
import { _prepareProperties, ApplyMeta } from '../tools/Utils';
import { Config } from '../Config';
import { TiledContainer} from './../objects/TiledContainer';
import { TilesetManager } from '../tools/TilesetManagers';

export interface ILayerBuilder {
	Build(meta: ITiledLayer, tileset: TilesetManager, ...args: any[]): TiledContainer | undefined;
};

export const LayerBuilder = {
	Build(layer: ITiledLayer, tileset: TilesetManager, zOrder = 0): TiledContainer | undefined {

		const useDisplay: boolean = !!Config.usePixiDisplay && (PIXI as any).display !== undefined;
		const Layer = useDisplay ? (PIXI as any).display.Layer : {};
		const Group = useDisplay ? (PIXI as any).display.Group : {};

		_prepareProperties(layer);

		const props = layer.parsedProps;

		if (props.ignore || props.ignoreLoad) {
			console.log('[TILED] layer ignored:' + layer.name);
			return undefined;
		}

		const layerObject: TiledContainer = useDisplay
			? new Layer(new Group(props.zOrder !== undefined ? props.zOrder : zOrder, true))
			: new TiledContainer();

		layerObject.tiledId = layer.id;
		layerObject.name = layer.name;
		layerObject.visible = layer.visible;

		layerObject.position.set(layer.x, layer.y);
		layerObject.alpha = layer.opacity || 1;

		ApplyMeta(layer, layerObject);
		return layerObject;
	},
};
