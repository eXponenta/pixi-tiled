import * as PIXI from "pixi.js";
declare module "pixi.js" {
    interface Container {
        getChildByPath<T extends PIXI.DisplayObject>(query: string): T | undefined;
        addGlobalChild(...child: PIXI.DisplayObject[]): PIXI.DisplayObject;
    }
}
export default function (pack: {
    Container: any;
}): void;
