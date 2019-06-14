import {utils} from "pixi.js"

declare module "pixi.js" {
	namespace utils {
		export interface EventEmitter {
			onceAsynce(event: string): Promise<any>;
		}
	}
}

export default function() {
    utils.EventEmitter.prototype.onceAsynce = async function(event: string) : Promise<any> {
        return new Promise((res)=>{
            this.once(event, res, this);
        })
    }
}