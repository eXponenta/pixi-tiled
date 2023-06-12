//inject TILED importer but skip middleware Injecting, only mixins and configs
PIXI.tiled.Inject(PIXI, { injectMiddleware: true, debugContainers: true });

var app = new PIXI.Application({
	width: 512,
	height: 512,
});

document.body.appendChild(app.view);

//load map with dependencies
PIXI.Assets.add('map', './assets/map-with-external-tileset.json');
PIXI.Assets.load(['map']).then(loaded);

function loaded() {
	const map = PIXI.Assets.get('map');
	const create = PIXI.tiled.CreateStage(null, map);
	app.stage.addChild(create);

	app.ticker.add(gameLoop);
}

function gameLoop(dt) {}
