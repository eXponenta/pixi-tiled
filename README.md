# pixi-tiled #

Tiled importer for Objects, Layouts, Texts and Shapes.

# TILEMAPS #

Basic Support since 1.1.14.

For faster realisation use `pixi-tilemap`, it will added as external renderer soon.


# How to use #
`npm install pixiv5-tiled`

### Fully automatically importing. Images would be resolved automatically

```
import {Inject} from "pixiv5-tiled"
import * as PIXI from "pixi.js"

Inject(PIXI);

....

var loader = new PIXI.Loader();
loader.add("map","path/to/your/map.json")
      .load(()=>{
          //stage was builded automatically
          let stage = app.loader.resources["map"].stage;
      });
```

### Manual

```
import {Inject, Build} from "pixiv5-tiled"
import * as PIXI from "pixi.js"

//Inject only Mixins and apply global configuration 
Inject(PIXI, {injectMiddleware : false});

....

var loader = new PIXI.Loader();
loader.add("map","path/to/your/map.json")
    .add("atlass", "path/to/your/atlass.png)
    .load(()=>{

        const mapData = app.loader.resources["map"].data;
        const atlas = app.loader.resources["atlass"].spritesheet;

        //build manualy from map data and atlass
        const stage = TiledOG.CreateStage(atlas, map);
      });
```

### Mixins

`Inject` add some mixins to PIXI API:

`PIXI.Container`:
* `getChildByPath<T>(path : string) : T | undefined` -  Search child of container by relative path 
* `addGlobalChild(...childs : DisplayObject[]) : void` - Adding childs to container from other container and recalculating them's transforms relative new parent

`PIXI.DisplayObject`:
* `replaceWithTransform (target : DisplayObject)` - replaсe `target` into `this` from  `target` parent container and copying it transforms (position, scale, rotation, pivot);

`PIXI.utils.EventEmitter` : 
* `onceAsync(eventName : string, context : eny) : Promise<any>` - call `once` in promise-like style for `async/await` support.



### Demo
Go to demo folder: [./demo](./demo)

#### Live:
* Midellware: [./midellware.html](https://exponenta.github.io/pixi-tiled/demo/midellware.html)

* By constructor: [./constructor.html](https://exponenta.github.io/pixi-tiled/demo/constructor.html)

* Tilemap: [./tilemap.html](https://exponenta.github.io/pixi-tiled/demo/tilemap.html)
