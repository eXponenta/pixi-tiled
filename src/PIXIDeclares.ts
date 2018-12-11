declare module PIXI {
	export interface Container {
		types?: ArrayLike<string>;
		parentGroup?: string;
		tiledId?: number;
	}
	var tiled: typeof TiledOG;
}


