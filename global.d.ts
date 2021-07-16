import type { DisplayObject } from "@pixi/display";
import { IParsedProps } from "./src/ITiledMap";


declare namespace GlobalMixins {
    export interface Container {
        getChildByPath<T extends DisplayObject>(query: string): T | undefined;
		addGlobalChild(...child: DisplayObject[]): DisplayObject;
		properties?: IParsedProps;
    }

    export interface DisplayObject {
		replaceWithTransform(from: DisplayObject): void
	}

    namespace utils {
		export interface EventEmitter {
			onceAsync(event: string, context? : any): Promise<any>;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface AnimatedSprite
    {

    }


}