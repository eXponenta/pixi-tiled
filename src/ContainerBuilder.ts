namespace TiledOG.ContainerBuilder {
	export function ApplyMeta(meta: any, target: PIXI.Container) {
		
		target.name = meta.name;
		target.tiledId = meta.id;
		target.width = meta.width || target.width;
		target.height = meta.height || target.height;

		target.rotation = ((meta.rotation || 0) * Math.PI) / 180.0;

		if(meta.x)
			target.x = meta.x;
		if(meta.y)
			target.y = meta.y;
		
		target.visible = meta.visible == undefined ? true : meta.visible;
		target.types = meta.type ? meta.type.split(":") : [];

		const type = Tiled.Utils.Objectype(meta);

		(target as TiledContainer).primitive = TiledOG.Primitives.BuildPrimitive(meta);

		if (meta.properties) {
			target.alpha = meta.properties.opacity || 1;
			Object.assign(target, meta.properties);
		}

		if (TiledOG.Config.debugContainers) {
			setTimeout(() => {
				const rect = new PIXI.Graphics();

				rect.lineStyle(2, 0xff0000, 0.7)
					.drawRect(target.x, target.y, meta.width, meta.height)
					.endFill();
				if (target instanceof PIXI.Sprite) {
					rect.y -= target.height;
				}
				target.parent.addChild(rect);
			}, 30);
		}
	}

	export function Build(meta: any): PIXI.DisplayObject {
		const types: Array<string> = meta.type ? meta.type.split(":") : [];

		let container = undefined; // new TiledOG.TiledContainer();

		if (types.indexOf("mask") > -1) {
			container = new PIXI.Sprite(PIXI.Texture.WHITE);
		} else {
			container = new TiledOG.TiledContainer();
		}

		if (meta.gid) {
			if (container instanceof PIXI.Sprite) {
				container.anchor = Config.defSpriteAnchor as PIXI.ObservablePoint;
			} else {
				container.pivot = Config.defSpriteAnchor as PIXI.ObservablePoint;
				container.hitArea = new PIXI.Rectangle(0, 0, meta.width, meta.height);
			}
		}

		ApplyMeta(meta, container);

		return container;
	}
}
