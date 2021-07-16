import { Sprite } from '@pixi/sprite';
import { ITiledTile, ITiledSprite, ITiledObjectLayer } from './../ITiledMap';
import { TileAnimator } from './TiledAnimator';
import { Config } from './../Config';
import { BuildPrimitive } from './TiledPrimitives';
import { ITiledPtimitive } from './TiledPrimitives';
import { ApplyMeta } from '../tools/Utils';

export class TiledSprite extends Sprite {
	public tileFrame?: ITiledTile;
	public source?: ITiledSprite;
	public primitives: ITiledPtimitive[] = [];
	public properties: Record<string, any> = {};
	
	private _animator?: TileAnimator;

	constructor(source: ITiledSprite, createAnimator = false, autoInit = true) {
		super(source.image!.texture);

		this.source = source;
		this.tileFrame = source.image!;

		if (createAnimator && this.tileFrame.animation) {
			this.anim = new TileAnimator(this.tileFrame!);
		}

		if(autoInit) {
			this.init();
		}
	}

	init() {
		ApplyMeta(this.source!, this as any);

		if (this.anim) {
			const a = this.anim.anim;

			this.properties!.animPlaying && a.play();
			a.loop = this.properties!.animLoop !== undefined ? !!this.properties!.animLoop : true;
		}

		//TODO Set anchor and offsets to center (.5, .5)
		if (this.source!.gid) {
			this.anchor.copyFrom( (this.source!.anchor ||  Config.defSpriteAnchor) as any);
		}

		const obj = this.tileFrame!.objectgroup as ITiledObjectLayer;

		if (obj) {
			this.primitives = obj.objects.map(e => BuildPrimitive(e)!);
		}

		const hFlip = this.source!.hFlip;
		const vFlip = this.source!.vFlip;

		if (hFlip) {
			this.scale.x *= -1;
			this.anchor.x = 1;
		}

		if (vFlip) {
			this.scale.y *= -1;
			this.anchor.y = 0;
		}
	}

	set anim(anim: TileAnimator | undefined) {
		if (anim === this._animator) return;

		if (this._animator) {
			this._animator.remove(this);
		}
		this._animator = anim;

		anim && anim.add(this);
	}

	get anim() {
		return this._animator;
	}

	clone() {
		const sprite = new TiledSprite(this.source!, true);
		sprite.init();

		return sprite;
	}
}
