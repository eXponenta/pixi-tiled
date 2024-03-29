//inject TILED importer but skip middleware Injecting, only mixins and configs
PIXI.tiled.Inject(PIXI, { injectMiddleware: false, debugContainers: true });

var app = new PIXI.Application({
	width: 1280,
	height: 1280,
});

document.body.appendChild(app.view);

//load map with dependencies
app.loader.baseUrl = './../assets/';
app.loader
	.add('map', 'desert.json')
	.add('texture', "tmw_desert_spacing.png")
	.load(loaded);

function loaded() {
	const data = app.loader.resources['map'].data;
	const tex = app.loader.resources['texture'].texture;

	const create = PIXI.tiled.CreateStage({
		"tmw_desert_spacing.png": tex
	}, data);

	app.stage.addChild(create);

	app.ticker.add(gameLoop);

	window.app = app;
}

function gameLoop(dt) {}
