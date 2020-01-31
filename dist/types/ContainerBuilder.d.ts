import { TiledContainer } from "./TiledContainer";
import { DisplayObject } from "pixi.js";
import { ITiledObject, ITiledLayer } from "./ITiledMap";
export declare function ApplyMeta(meta: ITiledObject | ITiledLayer, target: TiledContainer): void;
export declare function Build(meta: ITiledObject): DisplayObject;
