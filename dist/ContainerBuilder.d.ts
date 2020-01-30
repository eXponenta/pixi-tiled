import { DisplayObject, Container } from "pixi.js";
import { ITiledObject, ITiledLayer } from "./ITiledMap";
export declare function ApplyMeta(meta: ITiledObject | ITiledLayer, target: Container): void;
export declare function Build(meta: ITiledObject): DisplayObject;
