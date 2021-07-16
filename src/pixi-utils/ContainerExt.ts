import { DisplayObject, Container } from "@pixi/display";
import { Matrix } from "@pixi/math";


export default function (container: typeof Container) {

	if (!container)
		throw new Error("Cant't find Container in package!");

	/**
	 * @mixes
	 * MIXIN FROM pixiv5-tiled
	 * Get child by path
	 */

	Object.assign(container.prototype,
		{
			getChildByPath: function <T extends DisplayObject>(path: string) {
				const _this = <Container> <any> this;
				
				if (!_this.children || _this.children.length == 0)
					return undefined;

				let result: DisplayObject | undefined = _this;

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
					result = (result as any).getChildByName(p);
				}

				return result as T;
			},

			addGlobalChild: function (...child: DisplayObject[]) {
				const _this = <Container> <any> this;
				//TODO: better to convert global position to current matrix
				_this.transform.updateLocalTransform();
				
				const loc = new Matrix();
				const invert = _this.transform.localTransform.clone().invert();
				
				for (let i = 0; i < child.length; i++) {

					const newChild = child[i];
					newChild.transform.updateLocalTransform();
					loc.copyFrom(invert);
					loc.append(newChild.localTransform);
					child[i].transform.setFromMatrix(loc);
				}

				return _this.addChild(...child);

			}
		});
}
