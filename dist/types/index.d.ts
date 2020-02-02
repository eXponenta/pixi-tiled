declare global {
    interface Window {
        PIXI: any;
    }
}
declare const VERSION = "__VERSION__";
import * as ContainerBuilder from './builders/ContainerBuilder';
import * as SpriteBuilder from './builders/SpriteBuilder';
import * as TextBuilder from './builders/TextBuilder';
import { Parser, CreateStage } from './tools/TiledObjectParser';
import { Config, ITiledProps } from './Config';
import { TiledContainer } from './objects/TiledContainer';
export declare function Inject(pixiPack?: any, props?: Partial<ITiledProps> | undefined): void;
import * as Primitives from './objects/TiledPrimitives';
import { MultiSpritesheet } from './tools/TiledMultiSheet';
export { Primitives };
export { Parser };
export { CreateStage };
export { Config };
export { ContainerBuilder };
export { SpriteBuilder };
export { TextBuilder };
export { TiledContainer };
export { MultiSpritesheet };
export { VERSION };
