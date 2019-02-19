declare module PIXI.tiled.ContainerBuilder {
    function ApplyMeta(meta: any, target: PIXI.Container): void;
    function Build(meta: any): PIXI.DisplayObject;
}
declare module PIXI.tiled {
    let Config: ITiledProps;
    let Builders: Array<Function>;
    interface ITiledProps {
        defSpriteAnchor?: PIXI.Point;
        debugContainers?: boolean;
        usePixiDisplay?: boolean;
        roundFontAlpha?: boolean;
    }
    function InjectToPixi(props?: ITiledProps | undefined): void;
}
declare module PIXI {
    interface Container {
        types?: ArrayLike<string>;
        tiledId?: number;
    }
}
declare module PIXI.tiled {
}
declare module PIXI.tiled.SpriteBuilder {
    function Build(meta: any): PIXI.DisplayObject;
}
declare module PIXI.tiled.TextBuilder {
    function Build(meta: any): PIXI.DisplayObject;
}
declare namespace Tiled {
    class MultiSpritesheet {
        sheets: PIXI.Spritesheet[];
        images: {
            [name: string]: PIXI.Texture;
        };
        constructor(sheets?: PIXI.Spritesheet[]);
        add(sheet?: PIXI.Spritesheet): void;
        addTexture(tex: PIXI.Texture, id: string): void;
        readonly textures: {
            [name: string]: PIXI.Texture;
        };
        readonly animations: {
            [name: string]: PIXI.Texture[];
        };
    }
}
declare module PIXI.tiled {
    class TiledContainer extends PIXI.Container {
        layerHeight: number;
        layerWidth: number;
        text?: PIXI.Text;
        primitive?: Primitives.ITiledPtimitive;
        tiledId?: number;
    }
}
declare module PIXI {
    interface LoaderResource {
        stage?: PIXI.tiled.TiledContainer;
    }
}
declare module PIXI.tiled {
    function CreateStage(res: PIXI.LoaderResource | PIXI.Spritesheet | Tiled.MultiSpritesheet, loader: any): TiledContainer | undefined;
    let Parser: {
        Parse(res: PIXI.LoaderResource, next: Function): void;
        use(res: PIXI.LoaderResource, next: Function): void;
        add(): void;
    };
}
declare module PIXI.tiled.Primitives {
    interface ITiledPtimitive {
        name: string;
        types: Array<string>;
        visible: boolean;
    }
    class TiledRect extends PIXI.Rectangle implements ITiledPtimitive {
        name: string;
        types: string[];
        visible: boolean;
    }
    class TiledPoint extends PIXI.Point implements ITiledPtimitive {
        name: string;
        types: string[];
        visible: boolean;
        constructor(x?: number, y?: number);
    }
    class TiledPolygon extends PIXI.Polygon implements ITiledPtimitive {
        name: string;
        types: string[];
        visible: boolean;
        private _x;
        private _y;
        constructor(points: PIXI.Point[]);
        x: number;
        y: number;
        getBounds(): PIXI.Rectangle;
        width: number;
        height: number;
    }
    class TiledPolypine implements ITiledPtimitive {
        name: string;
        types: string[];
        visible: boolean;
        points: Array<PIXI.Point>;
        constructor(points: Array<PIXI.Point>);
    }
    class TiledEllipse extends PIXI.Ellipse implements ITiledPtimitive {
        name: string;
        types: string[];
        visible: boolean;
        constructor(x?: number, y?: number, hw?: number, hh?: number);
    }
    function BuildPrimitive(meta: any): ITiledPtimitive | undefined;
}
declare module PIXI.tiled.Utils {
    function HexStringToHexInt(value: string | number): number;
    function HexStringToAlpha(value: string | number): number;
    enum TiledObjectType {
        DEFAULT = 0,
        POINT = 1,
        POLYGON = 2,
        POLYLINE = 3,
        ELLIPSE = 4,
        TEXT = 5,
        IMAGE = 6
    }
    function Objectype(meta: any): TiledObjectType;
}
