import * as TiledOG from "./../dist";
import * as PIXI from "pixi.js";

function init() {

	//inject TILED importer but skip middleware Injecting, only mixins and configs
	TiledOG.Inject(PIXI, {injectMiddleware : true, debugContainers : true})
	var app = new PIXI.Application( {
		width: 800, height : 650 
	});
    document.body.appendChild(app.view);
   
    //load map with dependencies
    app.loader.add("map", "./../maps/demo.json")
            //.add("atlas", "./../maps/ui-atlas.json")
            .load(loaded);

    function loaded() {	
        const create = app.loader.resources["map"].stage;
 		//const atlas = app.loader.resources["atlas"].spritesheet;
        //const create = TiledOG.CreateStage(atlas, map);
		
		app.stage.addChild(create);
		
        app.ticker.add(gameLoop);
    }

    function gameLoop(dt) {

    }
}


document.addEventListener("DOMContentLoaded",   () => init());