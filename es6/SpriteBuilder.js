import { Config } from './Config';
import { Sprite, Texture } from "pixi.js";
import * as ContainerBuilder from "./ContainerBuilder";
import * as Primitives from "./TiledPrimitives";
export function сreateSprite(meta) {
    const sprite = new Sprite(Texture.EMPTY);
    if (!meta.fromImageLayer) {
        sprite.anchor = Config.defSpriteAnchor;
    }
    ContainerBuilder.ApplyMeta(meta, sprite);
    const obj = meta.img.objectgroup;
    if (obj) {
        sprite.primitive = Primitives.BuildPrimitive(obj.objects[0]);
    }
    const hFlip = meta.properties.hFlip;
    const vFlip = meta.properties.vFlip;
    if (hFlip) {
        sprite.scale.x *= -1;
        sprite.anchor.x = 1;
    }
    if (vFlip) {
        sprite.scale.y *= -1;
        sprite.anchor.y = 0;
    }
    return sprite;
}
export function Build(meta) {
    const sprite = сreateSprite(meta);
    return sprite;
}
