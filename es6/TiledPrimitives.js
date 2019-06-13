import { Rectangle, Point, Polygon, Ellipse } from "pixi.js";
import * as Utils from "./Utils";
export class TiledRect extends Rectangle {
    constructor() {
        super(...arguments);
        this.name = "";
        this.types = [];
        this.visible = true;
    }
}
export class TiledPoint extends Point {
    constructor(x, y) {
        super(x, y);
        this.name = "";
        this.types = [];
        this.visible = true;
    }
}
export class TiledPolygon extends Polygon {
    constructor(points) {
        super(points);
        this.name = "";
        this.types = [];
        this.visible = true;
        this._x = 0;
        this._y = 0;
    }
    set x(sX) {
        const delta = sX - this._x;
        this._x = sX;
        for (let xIndex = 0; xIndex < this.points.length; xIndex += 2) {
            this.points[xIndex] += delta;
        }
    }
    set y(sY) {
        const delta = sY - this._y;
        this._y = sY;
        for (let yIndex = 1; yIndex < this.points.length; yIndex += 2) {
            this.points[yIndex] += delta;
        }
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    getBounds() {
        let rect = new Rectangle();
        let maxX = this._x;
        let maxY = this._y;
        for (let index = 0; index < this.points.length; index += 2) {
            const px = this.points[index];
            const py = this.points[index + 1];
            rect.x = px < rect.x ? px : rect.x;
            rect.y = py < rect.y ? py : rect.y;
            maxX = px > maxX ? px : maxX;
            maxY = py > maxY ? py : maxY;
        }
        rect.width = maxX - rect.x;
        rect.height = maxY - rect.y;
        return rect;
    }
    get width() {
        return this.getBounds().width;
    }
    get height() {
        return this.getBounds().height;
    }
    set height(h) {
        const factor = h / this.height;
        for (let yIndex = 1; yIndex < this.points.length; yIndex += 2) {
            const delta = (this.points[yIndex] - this._y) * factor;
            this.points[yIndex] = this._y + delta;
            ;
        }
    }
    set width(w) {
        const factor = w / this.width;
        for (let xIndex = 0; xIndex < this.points.length; xIndex += 2) {
            const delta = (this.points[xIndex] - this._x) * factor;
            this.points[xIndex] = this._x + delta;
        }
    }
}
export class TiledPolypine {
    constructor(points) {
        this.name = "";
        this.types = [];
        this.visible = true;
        this.points = [];
        this.points = points.slice();
    }
}
export class TiledEllipse extends Ellipse {
    constructor(x, y, hw, hh) {
        super(x, y, hw, hh);
        this.name = "";
        this.types = [];
        this.visible = true;
    }
}
export function BuildPrimitive(meta) {
    if (!meta)
        return;
    let prim = undefined;
    let type = Utils.Objectype(meta);
    meta.x = meta.x || 0;
    meta.y = meta.y || 0;
    switch (type) {
        case Utils.TiledObjectType.ELLIPSE: {
            prim = new TiledEllipse(meta.x + 0.5 * meta.width, meta.y + 0.5 * meta.height, meta.width * 0.5, meta.height * 0.5);
            break;
        }
        case Utils.TiledObjectType.POLYGON: {
            let points = meta.polygon;
            let poses = points.map(p => {
                return new Point(p.x + meta.x, p.y + meta.y);
            });
            prim = new TiledPolygon(poses);
            break;
        }
        case Utils.TiledObjectType.POLYLINE: {
            let points = meta.polygon;
            let poses = points.map(p => {
                return new Point(p.x + meta.x, p.y + meta.y);
            });
            prim = new TiledPolypine(poses);
            break;
        }
        default:
            prim = new TiledRect(meta.x, meta.y, meta.width, meta.height);
    }
    prim.types = meta.type ? meta.type.split(":") : [];
    prim.visible = meta.visible;
    prim.name = meta.name;
    return prim;
}
