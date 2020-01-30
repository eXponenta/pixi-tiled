import { Point } from "pixi.js";
import { ITiledLayer, ILayerType } from "./ITiledMap";
import { TiledContainer } from ".";
import { ObjectLayerBuilder } from "./ObjectsLayerBuilder";
import { TilesetManager } from "./TilesetManagers";

export interface ITiledProps {
	defSpriteAnchor?: PIXI.Point;
	debugContainers?: boolean;
	usePixiDisplay?: boolean;
	roundFontAlpha?: boolean;
	injectMiddleware?: boolean;
}

export const Config: ITiledProps = {
	defSpriteAnchor: new Point(0, 1),
	debugContainers: false,
	usePixiDisplay: false,
	roundFontAlpha: false,
	injectMiddleware: true
};

type TLayerBuilder = {
	Build(meta: ITiledLayer, tileset: TilesetManager, ...args: any[]): TiledContainer | undefined;
};

export const LayerBuildersMap: { [key: string]: TLayerBuilder | undefined } = {
	tilelayer: undefined,
	objectgroup: ObjectLayerBuilder,
	imagelayer: ObjectLayerBuilder,
	group: undefined
};
