import * as PIXI from "pixi.js";
import { IParsedProps } from "../ITiledMap";
declare module "pixi.js" {
    interface Container {
        getChildByPath<T extends PIXI.DisplayObject>(query: string): T | undefined;
        addGlobalChild(...child: PIXI.DisplayObject[]): PIXI.DisplayObject;
        properties?: IParsedProps;
    }
}
export default function (pack: {
    Container: any;
}): void;
