import * as TiledOG from "../dist";
import * as PIXI from "pixi.js";

function init() {

	//inject TILED importer but skip middleware Injecting, only mixins and configs
	TiledOG.Inject(PIXI, {injectMiddleware : false, debugContainers : true})
	var app = new PIXI.Application( {
		width: 720, height : 1280 
	});
    document.body.appendChild(app.view);
   
    //load map with dependencies
    app.loader.add("map", "./../maps/ui-map.json")
            .add("atlas", "./../maps/ui-atlas.json")
            .load(loaded);

    function loaded() {	
        const map = app.loader.resources["map"].data;
		 const atlas = app.loader.resources["atlas"].spritesheet;
		 
		 console.log(map);
        const create = TiledOG.CreateStage(atlas, map);
		
		app.stage.addChild(create);
		app.stage.scale.set(app.screen.width / 1080)
		
        app.ticker.add(gameLoop);
    }

    function gameLoop(dt) {

    }
}


document.addEventListener("DOMContentLoaded",   () => init());