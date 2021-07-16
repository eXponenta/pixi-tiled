import { Rectangle, Point, Polygon, Ellipse } from "@pixi/math";
import { ITiledObject } from "./../ITiledMap";
import { TiledObjectType, Objectype } from "../tools/TiledObjectType";

export interface ITiledPtimitive {
	name: string;
	types: Array<string>;
	visible: boolean;
}

export class TiledRect extends Rectangle implements ITiledPtimitive {
	name: string = "";
	types: string[] = [];
	visible: boolean = true;
}

export class TiledPoint extends Point implements ITiledPtimitive {
	name: string = "";
	types: string[] = [];
	visible: boolean = true;

	constructor(x?: number, y?: number) {
		super(x, y);
	}
}

export class TiledPolygon extends Polygon implements ITiledPtimitive {
	name: string = "";
	types: string[] = [];
	visible: boolean = true;

	private _x: number = 0;
	private _y: number = 0;

	constructor(points: Point[]) {
		super(points);
	}

	set x(sX: number) {
		const delta = sX - this._x;
		this._x = sX;

		for (let xIndex = 0; xIndex < this.points.length; xIndex += 2) {
			this.points[xIndex] += delta;
		}
	}

	set y(sY: number) {
		const delta = sY - this._y;
		this._y = sY;

		for (let yIndex = 1; yIndex < this.points.length; yIndex += 2) {
			this.points[yIndex] += delta;
		}
	}

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}

	getBounds(): Rectangle {
		let rect = new Rectangle();

		let maxX: number = this._x;
		let maxY: number = this._y;

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

	get width(): number {
		return this.getBounds().width;
	}

	get height(): number {
		return this.getBounds().height;
	}

	set height(h: number) {
		const factor = h / this.height;

		for (let yIndex = 1; yIndex < this.points.length; yIndex += 2) {
			const delta = (this.points[yIndex] - this._y) * factor;
			this.points[yIndex] = this._y + delta;
		}
	}

	set width(w: number) {
		const factor = w / this.width;

		for (let xIndex = 0; xIndex < this.points.length; xIndex += 2) {
			const delta = (this.points[xIndex] - this._x) * factor;
			this.points[xIndex] = this._x + delta;
		}
	}
}

export class TiledPolypine implements ITiledPtimitive {
	name: string = "";
	types: string[] = [];
	visible: boolean = true;

	points: Array<Point> = [];

	constructor(points: Array<Point>) {
		this.points = points.slice();
	}
}

export class TiledEllipse extends Ellipse implements ITiledPtimitive {
	name: string = "";
	types: string[] = [];
	visible: boolean = true;

	constructor(x?: number, y?: number, hw?: number, hh?: number) {
		super(x, y, hw, hh);
	}
}

export function BuildPrimitive( meta: ITiledObject ): ITiledPtimitive | undefined {
	
	if (!meta) {
		return;
	}

	let prim: ITiledPtimitive | undefined = undefined;

	const type: TiledObjectType = Objectype(meta);

	meta.x = meta.x || 0;
	meta.y = meta.y || 0;

	switch (type) {
		case TiledObjectType.ELLIPSE: {
			prim = new TiledEllipse(
				meta.x + 0.5 * meta.width,
				meta.y + 0.5 * meta.height,
				meta.width * 0.5,
				meta.height * 0.5
			);
			break;
		}
		case TiledObjectType.POLYGON: {
			const points = meta.polygon!;
			const poses = points.map(p => {
				return new Point(p.x + meta.x, p.y + meta.y);
			});
			
			prim = new TiledPolygon(poses);
			break;
		}
		case TiledObjectType.POLYLINE: {
			const points = meta.polygon!;
			const poses = points.map(p => {
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
