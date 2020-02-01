import { Spritesheet, LoaderResource, ITextureDictionary } from 'pixi.js';
import { TiledContainer } from './TiledContainer';
import { MultiSpritesheet } from './TiledMultiSheet';
import { ITiledMap } from './ITiledMap';
import { TiledMapContainer } from './TiledMapContainer';
declare module 'pixi.js' {
    interface LoaderResource {
        stage?: TiledContainer;
    }
}
declare type tValidSheet = Spritesheet | MultiSpritesheet | ITextureDictionary;
export declare function CreateStage(sheet: tValidSheet | undefined, _data: ITiledMap, baseUrl?: string): TiledMapContainer | undefined;
export declare const Parser: {
    Parse(res: LoaderResource, next: Function): void;
    use(res: LoaderResource, next: Function): void;
    add(): void;
};
export {};
