import { EventEmitter } from '@pixi/utils';

export default function(eventEmitter: typeof EventEmitter) {
	if(!eventEmitter)
		throw new Error("Cant't find utils in package!");

    (<any> eventEmitter.prototype).onceAsync = function(event: string, context? : any) : Promise<any> {
        return new Promise((res)=>{
            this.once(event, res, context);
        })
    }
}