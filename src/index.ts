namespace TiledOG {
	export let Config: ITiledProps = {
		defSpriteAnchor: new PIXI.Point(0, 1),
		debugContainers: false,
		usePixiDisplay: false,
		roundFontAlpha: false
	};

	export let Builders: Array<Function> = [
		TiledOG.ContainerBuilder.Build,
		TiledOG.SpriteBuilder.Build,
		TiledOG.TextBuilder.Build
	];

	export interface ITiledProps {
		defSpriteAnchor?: PIXI.Point;
		debugContainers?: boolean;
		usePixiDisplay?: boolean;
		roundFontAlpha?: boolean;
	}

	export function InjectToPixi(props: ITiledProps | undefined = undefined) {
		if (props) {
			Config.defSpriteAnchor = props.defSpriteAnchor || Config.defSpriteAnchor;
			Config.debugContainers = props.debugContainers != undefined 
									? props.debugContainers 
									: Config.debugContainers;

			Config.usePixiDisplay = props.usePixiDisplay != undefined 
									? props.usePixiDisplay 
									: Config.usePixiDisplay;
			
			Config.roundFontAlpha = props.roundFontAlpha != undefined 
									? props.roundFontAlpha 
									: Config.roundFontAlpha;
		}

		PIXI.Loader.registerPlugin( TiledOG.Parser);
	}
}

//TiledOG.InjectToPixi();
