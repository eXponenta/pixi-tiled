import {Point} from "pixi.js";

export interface ITiledProps {
	defSpriteAnchor?: PIXI.Point;
	debugContainers?: boolean;
	usePixiDisplay?: boolean;
	roundFontAlpha?: boolean;
}

export let Config: ITiledProps = {
	defSpriteAnchor: new Point(0, 1),
	debugContainers: false,
	usePixiDisplay: false,
	roundFontAlpha: false
};