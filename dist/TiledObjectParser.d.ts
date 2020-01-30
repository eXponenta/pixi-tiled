import { Spritesheet, LoaderResource } from "pixi.js";
import { TiledContainer } from "./TiledContainer";
import MultiSpritesheet from "./TiledMultiSheet";
declare module "pixi.js" {
    interface LoaderResource {
        stage?: TiledContainer;
    }
}
export declare function CreateStage(res: LoaderResource | Spritesheet | MultiSpritesheet, loader: any): TiledContainer | undefined;
export declare const Parser: {
    Parse(res: LoaderResource, next: Function): void;
    use(res: LoaderResource, next: Function): void;
    add(): void;
};
