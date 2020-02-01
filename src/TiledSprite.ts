import { Sprite } from "pixi.js";
import { ITiledTile } from "./ITiledMap";
import { TileAnimator } from "./TiledAnimator";

export class TiledSprite extends Sprite {	
	public tileFrame?: ITiledTile;
	private _animator?: TileAnimator;

	constructor(tile: ITiledTile, createAnimator = false) {
		super(tile.texture);
		this.tileFrame = tile;

		if(createAnimator && this.tileFrame.animation) {
			this.anim = new TileAnimator(this.tileFrame!);
		}
	}

	set anim(anim: TileAnimator | undefined) {
		if(anim === this._animator) return;

		if(this._animator) {
			this._animator.remove(this);
		}		
		this._animator = anim;

		anim && anim.add(this);
	}
	
	get anim() {
		return this._animator;
	}
}