import { DisplayObject, Container } from '@pixi/display';
import { EventEmitter } from '@pixi/utils';


import container from "./ContainerExt";
import display from "./DisplayExt";
import emitter from "./EventEmitterExt";
 
export function InjectMixins(pixiPackage? : any) {
    if (pixiPackage) {
        console.log('Deprication. Mixins attached automatically')
    }

    container(Container);
    display(DisplayObject);
    emitter(EventEmitter);
}
