import { Spritesheet, Texture } from 'pixi.js';
export default class MultiSpritesheet {
    sheets: Spritesheet[];
    images: {
        [name: string]: Texture;
    };
    constructor(sheets?: Spritesheet[]);
    add(sheet?: Spritesheet): void;
    addTexture(tex: Texture, id: string): void;
    readonly textures: {
        [name: string]: Texture;
    };
    readonly animations: {
        [name: string]: Texture[];
    };
}
