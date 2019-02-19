namespace TiledOG {
    export class TiledContainer extends PIXI.Container {
        layerHeight: number = 0;
        layerWidth: number = 0;
        text?:PIXI.Text;
        primitive?: Primitives.ITiledPtimitive;
        tiledId?: number
    }
}
