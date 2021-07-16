const {main} = require('@pixi-build-tools/rollup-configurator/main');

module.exports = () => main(
	{
		globals: {
			"@pixi/sprite-animated": "PIXI"
		}
	});