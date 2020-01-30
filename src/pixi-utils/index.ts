import container from "./ContainerExt";
import display from "./DisplayExt";
import emitter from "./EventEmitterExt";
 
export function InjectMixins(pixiPackage : any) {
    container(pixiPackage);
    display(pixiPackage);
    emitter(pixiPackage);
}
