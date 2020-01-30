import { Spritesheet, Texture } from "pixi.js";
export declare class MultiSpritesheet {
    sheets: Array<Spritesheet | MultiSpritesheet>;
    images: {
        [name: string]: Texture;
    };
    constructor(sheets?: Spritesheet[]);
    add(sheet?: Spritesheet | MultiSpritesheet): void;
    addTexture(tex: Texture, id: string): void;
    readonly textures: {
        [name: string]: Texture;
    };
    readonly animations: {
        [name: string]: Texture[];
    };
}
