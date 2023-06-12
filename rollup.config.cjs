const {main} = require('@pixi-build-tools/rollup-configurator/main');

module.exports = () => main(
	{
		external: [
			"@pixi/assets"
		],
		globals: {
			"@pixi/sprite-animated": "PIXI",
			"@pixi/assets": "PIXI",
		}
	});