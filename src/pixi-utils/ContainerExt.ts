import * as PIXI from "pixi.js";
import { IParsedProps } from "../ITiledMap";

declare module "pixi.js" {
	export interface Container {
        getChildByPath<T extends PIXI.DisplayObject>(query: string): T | undefined;
		addGlobalChild(...child: PIXI.DisplayObject[]): PIXI.DisplayObject;
		properties?: IParsedProps;
	}
}

export default function(pack : {Container : any}) {
	
	if(!pack.Container)
		throw new Error("Cant't find Container in package!");
	
	/**
	 * @mixes
	 * MIXIN FROM pixiv5-tiled
	 * Get child by path
	 */
	PIXI.Container.prototype.getChildByPath = function<T extends PIXI.DisplayObject>(path: string) {
		if (!this.children || this.children.length == 0) return undefined;

		let result: PIXI.DisplayObject | undefined = this;

		const split = path.split("/");
		const isIndex = new RegExp("(?:{{0})-?d+(?=})");

		for (const p of split) {
			//@ts-ignore
			if (result == undefined || !(result.children)) {
				result = undefined;
				break;
			}

			if (p.trim().length == 0) continue;

			// find by index
			//@ts-ignore
			const ch = result.children;
			const mathes = p.match(isIndex);
			if (mathes) {
				let index = parseInt(mathes[0]);
				if (index < 0) {
					index += ch.length;
				}
				if (index >= ch.length) {
					result = undefined;
				} else {
					result = ch[index];
				}
				continue;
			}

			//default by name
			result = (result as PIXI.Container).getChildByName(p);
		}

		return result as T;
	}
	
	PIXI.Container.prototype.addGlobalChild = function(...child: PIXI.DisplayObject[]) {
		//TODO: better to convert global position to current matrix
		this.transform.updateLocalTransform();
		const loc = new PIXI.Matrix();
		const invert = this.transform.localTransform.clone().invert();
		for (let i = 0; i < child.length; i++) {

			const newChild = child[i];
			newChild.transform.updateLocalTransform();
			loc.copyFrom(invert);
			loc.append(newChild.localTransform);
			child[i].transform.setFromMatrix(loc);
		}

		return this.addChild(...child);
	}
}
