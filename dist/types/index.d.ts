declare global {
    interface Window {
        PIXI: any;
    }
}
declare const VERSION = "__VERSION__";
import * as ContainerBuilder from './ContainerBuilder';
import * as SpriteBuilder from './SpriteBuilder';
import * as TextBuilder from './TextBuilder';
import { Parser, CreateStage } from './TiledObjectParser';
import { Config, ITiledProps } from './Config';
import { TiledContainer } from './TiledContainer';
export declare function Inject(pixiPack?: any, props?: Partial<ITiledProps> | undefined): void;
import * as Primitives from './TiledPrimitives';
import { MultiSpritesheet } from './TiledMultiSheet';
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
