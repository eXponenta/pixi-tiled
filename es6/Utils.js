export function HexStringToHexInt(value) {
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
export function HexStringToAlpha(value) {
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
export var TiledObjectType;
(function (TiledObjectType) {
    TiledObjectType[TiledObjectType["DEFAULT"] = 0] = "DEFAULT";
    TiledObjectType[TiledObjectType["POINT"] = 1] = "POINT";
    TiledObjectType[TiledObjectType["POLYGON"] = 2] = "POLYGON";
    TiledObjectType[TiledObjectType["POLYLINE"] = 3] = "POLYLINE";
    TiledObjectType[TiledObjectType["ELLIPSE"] = 4] = "ELLIPSE";
    TiledObjectType[TiledObjectType["TEXT"] = 5] = "TEXT";
    TiledObjectType[TiledObjectType["IMAGE"] = 6] = "IMAGE";
})(TiledObjectType || (TiledObjectType = {}));
export function Objectype(meta) {
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
