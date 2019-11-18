import * as PIXI from "pixi.js";
declare module "pixi.js" {
    interface Container {
        getChildByPath<T extends PIXI.DisplayObject>(query: string): T | undefined;
        addGlobalChild(...child: PIXI.DisplayObject[]): PIXI.DisplayObject;
        properties: any;
    }
}
export default function (pack: {
    Container: any;
}): void;
