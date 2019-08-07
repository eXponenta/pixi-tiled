import container from "./ContainerExt";
import display from "./DisplayExt";
import emitter from "./EventEmitterExt";
 
const path = function(pixiPackage : any) {
    container(pixiPackage);
    display(pixiPackage);
    emitter(pixiPackage);
}

export default path;