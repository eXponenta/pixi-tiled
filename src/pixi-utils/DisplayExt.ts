import {DisplayObject} from "pixi.js";

declare module "pixi.js" {
	export interface DisplayObject {
		replaceWithTransform(from:DisplayObject): void
	}
}

export default function() {
	DisplayObject.prototype.replaceWithTransform = function(from: DisplayObject) {
        
        from.updateTransform();
        
        if(from.parent)
            from.parent.addChildAt(this, from.parent.getChildIndex(from));
        
        this.position.copyFrom(from.position);
        this.scale.copyFrom(from.scale);
        this.rotation = from.rotation;
        
        this.updateTransform();
    }
}