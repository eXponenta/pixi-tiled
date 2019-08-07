declare module "pixi.js" {
	namespace utils {
		export interface EventEmitter {
			onceAsync(event: string, context? : any): Promise<any>;
		}
	}
}

export default function(pack : {utils : any}) {
	if(!pack.utils)
		throw new Error("Cant't find utils in package!");

    pack.utils.EventEmitter.prototype.onceAsync = function(event: string, context? : any) : Promise<any> {
        return new Promise((res)=>{
            this.once(event, res, context);
        })
    }
}