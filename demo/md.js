//inject TILED importer but skip middleware Injecting, only mixins and configs
PIXI.TiledOG.Inject(PIXI, { injectMiddleware: true, debugContainers: true });

var app = new PIXI.Application({
	width: 800,
	height: 650,
});

document.body.appendChild(app.view);

//load map with dependencies
app.loader.add('map', './maps/demo.json').load(loaded);

function loaded() {
	const create = app.loader.resources['map'].stage;

	app.stage.addChild(create);

	app.ticker.add(gameLoop);
}

function gameLoop(dt) {}
