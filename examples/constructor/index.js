//inject TILED importer but skip middleware Injecting, only mixins and configs
PIXI.tiled.Inject(PIXI, { injectMiddleware: false, debugContainers: true });

var app = new PIXI.Application({
	width: 720,
	height: 1280,
});

document.body.appendChild(app.view);

//load map with dependencies
PIXI.Assets.add('map', './assets/ui-map.json');
PIXI.Assets.add('atlas', './assets/ui-atlas.json');
PIXI.Assets.load(['map', 'atlas']).then(loaded);

function loaded() {
	const map = PIXI.Assets.get('map');
	const atlas = PIXI.Assets.get('atlas');	
	const create = PIXI.tiled.CreateStage(atlas, map);
	
	app.stage.addChild(create);
	app.stage.scale.set(app.screen.width / 1080);
	
	app.ticker.add(gameLoop);
}

function gameLoop(dt) {}
