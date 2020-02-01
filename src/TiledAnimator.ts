import { TiledSprite } from "./TiledSprite";
import { AnimatedSprite } from "pixi.js";
import { ITiledTile } from "./ITiledMap";

export class TileAnimator {
	private _animator: AnimatedSprite;
	private _childs: Set<TiledSprite> = new Set();
	private _tile: ITiledTile;

	constructor(tile: ITiledTile) {

		if(!tile.animation) {
			throw new Error("Tile has not animation!");
		}

		this._tile = tile;
		this._animator = new AnimatedSprite(tile.animation);
		this._animator.onFrameChange = this.__onFrame.bind(this);
	}

	__onFrame() {
		this._childs.forEach((e)=> e.texture = this._animator.texture);
	}

	get anim() {
		return this._animator;
	}

	add(s: TiledSprite, strict = true) {
		if(!s) return;

		// prevent stack 
		if(this._childs.has(s)) return;
		
		s.anim = this;

		if(s.tileFrame !== this._tile && strict) {
			throw (`Invalid sprite! One Animator per tile type! Pased ${s.tileFrame!.id} should be ${this._tile.id}`);
		}

		this._childs.add(s);
	}

	remove(s: TiledSprite) {
		this._childs.delete(s);
	}
}