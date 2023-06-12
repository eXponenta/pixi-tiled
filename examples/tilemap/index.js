//inject TILED importer but skip middleware Injecting, only mixins and configs
PIXI.tiled.Inject(PIXI, { injectMiddleware: false, debugContainers: true });

var app = new PIXI.Application({
	width: 1280,
	height: 1280,
});

document.body.appendChild(app.view);

//load map with dependencies
PIXI.Assets.add('map', './assets/desert.json');
PIXI.Assets.add('texture', "./assets/tmw_desert_spacing.png");
PIXI.Assets.load(['map', 'texture']).then(loaded);

function loaded() {
	const data = PIXI.Assets.get('map');
	const tex = PIXI.Assets.get('texture').texture;

	const create = PIXI.tiled.CreateStage({
		"tmw_desert_spacing.png": tex
	}, data);

	app.stage.addChild(create);

	app.ticker.add(gameLoop);

	window.app = app;
}

function gameLoop(dt) {}
