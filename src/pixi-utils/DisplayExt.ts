

declare module "pixi.js" {
	export interface DisplayObject {
		replaceWithTransform(from:DisplayObject): void
	}
}

export default function(pack : {DisplayObject : any}) {

	if(!pack.DisplayObject)
		throw new Error("Cant't find DisplayObject in package!");
	
	pack.DisplayObject.prototype.replaceWithTransform = function(from: any) {
        
        from.updateTransform();
        
        if(from.parent)
            from.parent.addChildAt(this, from.parent.getChildIndex(from));
        
        this.position.copyFrom(from.position);
        this.scale.copyFrom(from.scale);
        this.rotation = from.rotation;
        
        this.updateTransform();
    }
}