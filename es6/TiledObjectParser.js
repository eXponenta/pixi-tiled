import { Spritesheet, LoaderResource, Loader } from 'pixi.js';
import { TiledContainer } from './TiledContainer';
import { Config } from './Config';
import * as Utils from "./Utils";
import * as ContainerBuilder from "./ContainerBuilder";
import * as TextBuilder from "./TextBuilder";
import * as SpriteBuilder from "./SpriteBuilder";
let showHello = true;
function PrepareOject(layer) {
    let props = {};
    if (layer.properties) {
        if (layer.properties instanceof Array) {
            for (var p of layer.properties) {
                let val = p.value;
                if (p.type == "color")
                    val = Utils.HexStringToHexInt(val);
                props[p.name] = val;
            }
        }
        else {
            props = layer.properties;
        }
    }
    if (layer.gid) {
        const gid = layer.gid;
        const vFlip = gid & 0x40000000;
        const hFlip = gid & 0x80000000;
        const dFlip = gid & 0x20000000;
        props["vFlip"] = vFlip;
        props["hFlip"] = hFlip;
        props["dFlip"] = dFlip;
        const realGid = gid & (~(0x40000000 | 0x80000000 | 0x20000000));
        layer.gid = realGid;
    }
    layer.properties = props;
}
function ImageFromTileset(tilesets, baseUrl, gid) {
    var tileSet = undefined;
    for (let i = 0; i < tilesets.length; i++) {
        if (tilesets[i].firstgid <= gid) {
            tileSet = tilesets[i];
        }
    }
    if (!tileSet) {
        console.log("Image with gid:" + gid + " not found!");
        return null;
    }
    const realGid = gid - tileSet.firstgid;
    let find = tileSet.tiles.filter((obj) => obj.id == realGid)[0];
    let img = Object.assign({}, find);
    if (!img) {
        console.log("Load res MISSED gid:" + realGid);
        return null;
    }
    img.image = baseUrl + img.image;
    return img;
}
export function CreateStage(res, loader) {
    let _data = {};
    if (res instanceof LoaderResource) {
        _data = res.data;
    }
    else {
        _data = loader;
    }
    if (!_data || _data.type != "map") {
        return undefined;
    }
    if (showHello) {
        console.log("Tiled OG importer!\n eXponenta {rondo.devil[a]gmail.com}");
        showHello = false;
    }
    const useDisplay = Config.usePixiDisplay != undefined && Config.usePixiDisplay && PIXI.display != undefined;
    let Layer = useDisplay ? PIXI.display.Layer : {};
    let Group = useDisplay ? PIXI.display.Group : {};
    let Stage = useDisplay ? PIXI.display.Stage : {};
    const _stage = new TiledContainer();
    const cropName = new RegExp(/^.*[\\\/]/);
    _stage.layerHeight = _data.height;
    _stage.layerWidth = _data.width;
    let baseUrl = "";
    if (res instanceof LoaderResource) {
        _stage.name = res.url.replace(cropName, "").split(".")[0];
        baseUrl = res.url.replace(loader.baseUrl, "");
        baseUrl = baseUrl.match(cropName)[0];
    }
    if (_data.layers) {
        let zOrder = 0;
        if (useDisplay)
            _data.layers = _data.layers.reverse();
        for (let layer of _data.layers) {
            if (layer.type !== "objectgroup" && layer.type !== "imagelayer") {
                console.warn("OGParser support only OBJECT or IMAGE layes!!");
                continue;
            }
            PrepareOject(layer);
            const props = layer.properties;
            if (props.ignore || props.ignoreLoad) {
                console.log("OGParser: ignore loading layer:" + layer.name);
                continue;
            }
            const pixiLayer = useDisplay
                ? new Layer(new Group(props.zOrder !== undefined ? props.zOrder : zOrder, true))
                : new TiledContainer();
            zOrder++;
            pixiLayer.tiledId = layer.id;
            pixiLayer.name = layer.name;
            _stage.layers = {};
            _stage.layers[layer.name] = pixiLayer;
            pixiLayer.visible = layer.visible;
            pixiLayer.position.set(layer.x, layer.y);
            pixiLayer.alpha = layer.opacity || 1;
            ContainerBuilder.ApplyMeta(layer, pixiLayer);
            _stage.addChild(pixiLayer);
            if (layer.type == "imagelayer") {
                layer.objects = [
                    {
                        img: {
                            image: baseUrl + layer.image
                        },
                        gid: 123456789,
                        name: layer.name,
                        x: layer.x + layer.offsetx,
                        y: layer.y + layer.offsety,
                        fromImageLayer: true,
                        properties: layer.properties
                    }
                ];
            }
            if (!layer.objects)
                return undefined;
            let localZIndex = 0;
            for (let layerObj of layer.objects) {
                PrepareOject(layerObj);
                if (layerObj.properties.ignore)
                    continue;
                const type = Utils.Objectype(layerObj);
                let pixiObject = null;
                switch (type) {
                    case Utils.TiledObjectType.IMAGE: {
                        if (!layerObj.fromImageLayer) {
                            const img = ImageFromTileset(_data.tilesets, baseUrl, layerObj.gid);
                            if (!img) {
                                continue;
                            }
                            layerObj.img = img;
                        }
                        pixiObject = SpriteBuilder.Build(layerObj);
                        let sprite = pixiObject;
                        let cached = undefined;
                        if (loader instanceof Loader) {
                            cached = loader.resources[layerObj.img.image];
                        }
                        else if (res instanceof Spritesheet) {
                            cached = res.textures[layerObj.img.image];
                        }
                        if (!cached) {
                            if (loader instanceof Loader) {
                                loader.add(layerObj.img.image, {
                                    parentResource: res
                                }, () => {
                                    const tex = loader.resources[layerObj.img.image].texture;
                                    sprite.texture = tex;
                                    if (layerObj.fromImageLayer) {
                                        sprite.scale.set(1);
                                    }
                                });
                            }
                            else {
                                continue;
                            }
                        }
                        else {
                            if (cached instanceof LoaderResource) {
                                if (!cached.isComplete) {
                                    cached.onAfterMiddleware.once((e) => {
                                        sprite.texture = cached.texture;
                                        if (layerObj.fromImageLayer) {
                                            sprite.scale.set(1);
                                        }
                                    });
                                }
                                else {
                                    sprite.texture = cached.texture;
                                    if (layerObj.fromImageLayer) {
                                        sprite.scale.set(1);
                                    }
                                }
                            }
                            else if (cached) {
                                sprite.texture = cached;
                                if (layerObj.fromImageLayer) {
                                    sprite.scale.set(1);
                                }
                            }
                        }
                        break;
                    }
                    case Utils.TiledObjectType.TEXT: {
                        pixiObject = TextBuilder.Build(layerObj);
                        break;
                    }
                    default: {
                        pixiObject = ContainerBuilder.Build(layerObj);
                    }
                }
                if (Config.usePixiDisplay) {
                    pixiObject.parentGroup = pixiLayer.group;
                    _stage.addChildAt(pixiObject, localZIndex);
                }
                else {
                    pixiLayer.addChildAt(pixiObject, localZIndex);
                }
                localZIndex++;
            }
        }
    }
    return _stage;
}
export const Parser = {
    Parse(res, next) {
        var stage = CreateStage(res, this);
        res.stage = stage;
        next();
    },
    use(res, next) {
        Parser.Parse.call(this, res, next);
    },
    add() {
        console.log("Now you use Tiled!");
    }
};
