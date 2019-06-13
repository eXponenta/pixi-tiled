import { Container } from "pixi.js";
export class TiledContainer extends Container {
    constructor() {
        super(...arguments);
        this.layerHeight = 0;
        this.layerWidth = 0;
    }
}
