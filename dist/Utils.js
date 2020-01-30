"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function HexStringToHexInt(value) {
    if (!value)
        return 0;
    if (typeof value == "number")
        return value;
    value = value.length > 7 ? value.substr(3, 6) : value.substr(1, 6);
    try {
        return parseInt(value, 16);
    }
    catch (e) {
        console.warn("Color parse error:", e.message);
        return 0;
    }
}
exports.HexStringToHexInt = HexStringToHexInt;
function HexStringToAlpha(value) {
    if (!value)
        return 1;
    if (typeof value == "number")
        return value;
    if (value.length <= 7)
        return 1;
    try {
        return parseInt(value.substr(1, 2), 16) / 255.0;
    }
    catch (e) {
        console.warn("Alpha parse error:", e.message);
        return 1;
    }
}
exports.HexStringToAlpha = HexStringToAlpha;
var TiledObjectType;
(function (TiledObjectType) {
    TiledObjectType[TiledObjectType["DEFAULT"] = 0] = "DEFAULT";
    TiledObjectType[TiledObjectType["POINT"] = 1] = "POINT";
    TiledObjectType[TiledObjectType["POLYGON"] = 2] = "POLYGON";
    TiledObjectType[TiledObjectType["POLYLINE"] = 3] = "POLYLINE";
    TiledObjectType[TiledObjectType["ELLIPSE"] = 4] = "ELLIPSE";
    TiledObjectType[TiledObjectType["TEXT"] = 5] = "TEXT";
    TiledObjectType[TiledObjectType["IMAGE"] = 6] = "IMAGE";
})(TiledObjectType = exports.TiledObjectType || (exports.TiledObjectType = {}));
function Objectype(meta) {
    if (meta.properties && meta.properties.container)
        return TiledObjectType.DEFAULT;
    if (meta.gid || meta.image)
        return TiledObjectType.IMAGE;
    if (meta.text != undefined)
        return TiledObjectType.TEXT;
    if (meta.point)
        return TiledObjectType.POINT;
    if (meta.polygon)
        return TiledObjectType.POLYGON;
    if (meta.polyline)
        return TiledObjectType.POLYLINE;
    if (meta.ellipse)
        return TiledObjectType.ELLIPSE;
    return TiledObjectType.DEFAULT;
}
exports.Objectype = Objectype;
function resolveImageUrl(tilesets, baseUrl, gid) {
    var tileSet = undefined;
    var tilesetId = 0;
    for (var i = 0; i < tilesets.length; i++) {
        if (tilesets[i].firstgid <= gid) {
            tileSet = tilesets[i];
            tilesetId = i;
            break;
        }
    }
    if (!tileSet) {
        console.error("Image with gid:" + gid + " not found!");
        return null;
    }
    var realGid = gid - tileSet.firstgid;
    var find = tileSet.tiles.filter(function (obj) { return obj.id == realGid; })[0];
    var img = Object.assign({}, find, { tilesetId: tilesetId });
    if (!img) {
        console.error("Load res MISSED gid:" + realGid);
        return null;
    }
    return img;
}
exports.resolveImageUrl = resolveImageUrl;
function _prepareProperties(layer) {
    var props = {};
    if (layer.properties) {
        if (layer.properties instanceof Array) {
            for (var _i = 0, _a = layer.properties; _i < _a.length; _i++) {
                var p = _a[_i];
                var val = p.value;
                if (p.type == "color") {
                    val = HexStringToHexInt(val);
                }
                props[p.name] = val;
            }
        }
        else {
            props = layer.properties;
        }
    }
    var spriteObject = layer;
    if (spriteObject.gid) {
        var gid = spriteObject.gid;
        var vFlip = !!(gid & 0x40000000);
        var hFlip = !!(gid & 0x80000000);
        var dFlip = !!(gid & 0x20000000);
        props["vFlip"] = vFlip;
        props["hFlip"] = hFlip;
        props["dFlip"] = dFlip;
        spriteObject.vFlip = vFlip;
        spriteObject.hFlip = hFlip;
        var realGid = gid & ~(0x40000000 | 0x80000000 | 0x20000000);
        spriteObject.gid = realGid;
    }
    layer.parsedProps = props;
}
exports._prepareProperties = _prepareProperties;
//# sourceMappingURL=Utils.js.map