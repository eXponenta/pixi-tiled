import { DisplayObject } from '@pixi/display';

export default function(displayObject: typeof DisplayObject) {

	if(!displayObject)
		throw new Error("Cant't find DisplayObject in package!");
	
	(<any>displayObject.prototype).replaceWithTransform = function(from: any) {
        from.updateTransform();

        if(from.parent){
			from.parent.addChildAt(this, from.parent.getChildIndex(from));
		}

		this.pivot.copyFrom(from.pivot);        
        this.position.copyFrom(from.position);
		this.scale.copyFrom(from.scale);
		this.rotation = from.rotation;

        this.updateTransform();
    }
}