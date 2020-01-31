declare module "pixi.js" {
    interface DisplayObject {
        replaceWithTransform(from: DisplayObject): void;
    }
}
export default function (pack: {
    DisplayObject: any;
}): void;
