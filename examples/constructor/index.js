//inject TILED importer but skip middleware Injecting, only mixins and configs
PIXI.tiled.Inject(PIXI, { injectMiddleware: false, debugContainers: true });

var app = new PIXI.Application({
	width: 720,
	height: 1280,
});

document.body.appendChild(app.view);

//load map with dependencies
app.loader
	.add('map', './../assets/ui-map.json')
	.add('atlas', './../assets/ui-atlas.json')
	.load(loaded);

function loaded() {
	const map = app.loader.resources['map'].data;
	const atlas = app.loader.resources['atlas'].spritesheet;

	const create = PIXI.tiled.CreateStage(atlas, map);

	app.stage.addChild(create);
	app.stage.scale.set(app.screen.width / 1080);

	app.ticker.add(gameLoop);
}

function gameLoop(dt) {}
