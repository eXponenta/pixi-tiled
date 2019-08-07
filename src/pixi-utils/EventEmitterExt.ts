declare module "pixi.js" {
	namespace utils {
		export interface EventEmitter {
			onceAsync(event: string): Promise<any>;
		}
	}
}

export default function(pack : {utils : any}) {
	if(!pack.utils)
		throw new Error("Cant't find utils in package!");

    pack.utils.EventEmitter.prototype.onceAsync = async function(event: string) : Promise<any> {
        return new Promise((res)=>{
            this.once(event, res, this);
        })
    }
}