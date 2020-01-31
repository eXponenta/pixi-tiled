import { TiledContainer } from "./TiledContainer";
import { ITiledObject, ITiledLayer } from "./ITiledMap";
import { TiledSprite } from "./TiledSprite";
export declare function ApplyMeta(meta: ITiledObject | ITiledLayer, target: TiledContainer): void;
export declare function Build(meta: ITiledObject): TiledContainer | TiledSprite;
