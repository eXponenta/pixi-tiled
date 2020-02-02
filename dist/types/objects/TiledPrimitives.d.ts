import { Rectangle, Point, Polygon, Ellipse } from "pixi.js";
import { ITiledObject } from "./../ITiledMap";
export interface ITiledPtimitive {
    name: string;
    types: Array<string>;
    visible: boolean;
}
export declare class TiledRect extends Rectangle implements ITiledPtimitive {
    name: string;
    types: string[];
    visible: boolean;
}
export declare class TiledPoint extends Point implements ITiledPtimitive {
    name: string;
    types: string[];
    visible: boolean;
    constructor(x?: number, y?: number);
}
export declare class TiledPolygon extends Polygon implements ITiledPtimitive {
    name: string;
    types: string[];
    visible: boolean;
    private _x;
    private _y;
    constructor(points: Point[]);
    x: number;
    y: number;
    getBounds(): Rectangle;
    width: number;
    height: number;
}
export declare class TiledPolypine implements ITiledPtimitive {
    name: string;
    types: string[];
    visible: boolean;
    points: Array<Point>;
    constructor(points: Array<Point>);
}
export declare class TiledEllipse extends Ellipse implements ITiledPtimitive {
    name: string;
    types: string[];
    visible: boolean;
    constructor(x?: number, y?: number, hw?: number, hh?: number);
}
export declare function BuildPrimitive(meta: ITiledObject): ITiledPtimitive | undefined;
