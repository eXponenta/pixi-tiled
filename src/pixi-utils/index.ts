import container from "./ContainerExt";
import display from "./DisplayExt";
import emitter from "./EventEmitterExt";
 
const path = function() {
	
    container();
    display();
    emitter();
}

export default path;