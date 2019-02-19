
/// <reference path="../dist/pixi-tiled.d.ts" />

function init() {

    //inject to pixi loader 
    // TiledOG.InjectToPixi({
    //    debugContainers: true // enable containers as shapes debugging 
    //});

    var app = new PIXI.Application();
    document.body.appendChild(app.view);

   
    //load map with dependencies
    app.loader.add("map", "./maps/ui-map.json")
            .add("atlas", "./maps/ui-atlas.json")
            .load(loaded);

    function loaded() {
        
        //stage generate automatiсaly, all sprites lo
        const map = app.loader.resources["map"].data;
        const atlas = app.loader.resources["atlas"].spritesheet;
        const create = TiledOG.CreateStage(atlas, map);
        create.scale.set(0.5);
        app.stage.addChild(create);
        console.log(app.loader.resources);
        app.ticker.add(gameLoop);
    }

    function gameLoop(dt) {

    }
}