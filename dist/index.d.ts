declare global {
    interface Window {
        PIXI: any;
    }
}
import * as ContainerBuilder from "./ContainerBuilder";
import * as SpriteBuilder from "./SpriteBuilder";
import * as TextBuilder from "./TextBuilder";
import { Parser, CreateStage } from './TiledObjectParser';
import { Config, ITiledProps } from './Config';
import { TiledContainer } from './TiledContainer';
export declare let Builders: Array<Function>;
export declare function Inject(pixiPack?: any, props?: ITiledProps | undefined): void;
import * as Primitives from "./TiledPrimitives";
import MultiSpritesheet from './TiledMultiSheet';
export { Primitives };
export { Parser, CreateStage, Config, ContainerBuilder, SpriteBuilder, TextBuilder, TiledContainer, MultiSpritesheet };
