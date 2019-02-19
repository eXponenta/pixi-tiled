///<reference types="pixi.js"/>

declare module PIXI {
	export interface Container {
		types?: ArrayLike<string>;
		tiledId?: number;
	}
}

namespace TiledOG {
	(PIXI as any).tiled = TiledOG;
}
