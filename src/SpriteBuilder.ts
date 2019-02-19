namespace TiledOG.SpriteBuilder {
	function сreateSprite(meta: any): PIXI.Sprite {
		// TODO make load from texture atlass
		const sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);

		//TODO Set anchor and offsets to center (.5, .5)
		if (!meta.fromImageLayer) {
			sprite.anchor = Config.defSpriteAnchor as PIXI.ObservablePoint;
		}

		//debugger
		ContainerBuilder.ApplyMeta(meta, sprite);
		const obj = meta.img.objectgroup;
		if (obj) {
			(sprite as any).primitive = TiledOG.Primitives.BuildPrimitive(obj.objects[0]);
		}

		const hFlip = meta.properties.hFlip;
		const vFlip = meta.properties.vFlip;

		if (hFlip) {
			sprite.scale.x *= -1;
			sprite.anchor.x = 1;
		}

		if (vFlip) {
			sprite.scale.y *= -1;
			sprite.anchor.y = 0;
		}

		return sprite;
	}

	export function Build(meta: any): PIXI.DisplayObject {
		//debugger
		const sprite = сreateSprite(meta);

		return sprite;
	}
}
