"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var Utils = __importStar(require("./Utils"));
var TiledRect = (function (_super) {
    __extends(TiledRect, _super);
    function TiledRect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "";
        _this.types = [];
        _this.visible = true;
        return _this;
    }
    return TiledRect;
}(pixi_js_1.Rectangle));
exports.TiledRect = TiledRect;
var TiledPoint = (function (_super) {
    __extends(TiledPoint, _super);
    function TiledPoint(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.name = "";
        _this.types = [];
        _this.visible = true;
        return _this;
    }
    return TiledPoint;
}(pixi_js_1.Point));
exports.TiledPoint = TiledPoint;
var TiledPolygon = (function (_super) {
    __extends(TiledPolygon, _super);
    function TiledPolygon(points) {
        var _this = _super.call(this, points) || this;
        _this.name = "";
        _this.types = [];
        _this.visible = true;
        _this._x = 0;
        _this._y = 0;
        return _this;
    }
    Object.defineProperty(TiledPolygon.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (sX) {
            var delta = sX - this._x;
            this._x = sX;
            for (var xIndex = 0; xIndex < this.points.length; xIndex += 2) {
                this.points[xIndex] += delta;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TiledPolygon.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (sY) {
            var delta = sY - this._y;
            this._y = sY;
            for (var yIndex = 1; yIndex < this.points.length; yIndex += 2) {
                this.points[yIndex] += delta;
            }
        },
        enumerable: true,
        configurable: true
    });
    TiledPolygon.prototype.getBounds = function () {
        var rect = new pixi_js_1.Rectangle();
        var maxX = this._x;
        var maxY = this._y;
        for (var index = 0; index < this.points.length; index += 2) {
            var px = this.points[index];
            var py = this.points[index + 1];
            rect.x = px < rect.x ? px : rect.x;
            rect.y = py < rect.y ? py : rect.y;
            maxX = px > maxX ? px : maxX;
            maxY = py > maxY ? py : maxY;
        }
        rect.width = maxX - rect.x;
        rect.height = maxY - rect.y;
        return rect;
    };
    Object.defineProperty(TiledPolygon.prototype, "width", {
        get: function () {
            return this.getBounds().width;
        },
        set: function (w) {
            var factor = w / this.width;
            for (var xIndex = 0; xIndex < this.points.length; xIndex += 2) {
                var delta = (this.points[xIndex] - this._x) * factor;
                this.points[xIndex] = this._x + delta;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TiledPolygon.prototype, "height", {
        get: function () {
            return this.getBounds().height;
        },
        set: function (h) {
            var factor = h / this.height;
            for (var yIndex = 1; yIndex < this.points.length; yIndex += 2) {
                var delta = (this.points[yIndex] - this._y) * factor;
                this.points[yIndex] = this._y + delta;
            }
        },
        enumerable: true,
        configurable: true
    });
    return TiledPolygon;
}(pixi_js_1.Polygon));
exports.TiledPolygon = TiledPolygon;
var TiledPolypine = (function () {
    function TiledPolypine(points) {
        this.name = "";
        this.types = [];
        this.visible = true;
        this.points = [];
        this.points = points.slice();
    }
    return TiledPolypine;
}());
exports.TiledPolypine = TiledPolypine;
var TiledEllipse = (function (_super) {
    __extends(TiledEllipse, _super);
    function TiledEllipse(x, y, hw, hh) {
        var _this = _super.call(this, x, y, hw, hh) || this;
        _this.name = "";
        _this.types = [];
        _this.visible = true;
        return _this;
    }
    return TiledEllipse;
}(pixi_js_1.Ellipse));
exports.TiledEllipse = TiledEllipse;
function BuildPrimitive(meta) {
    if (!meta) {
        return;
    }
    var prim = undefined;
    var type = Utils.Objectype(meta);
    meta.x = meta.x || 0;
    meta.y = meta.y || 0;
    switch (type) {
        case Utils.TiledObjectType.ELLIPSE: {
            prim = new TiledEllipse(meta.x + 0.5 * meta.width, meta.y + 0.5 * meta.height, meta.width * 0.5, meta.height * 0.5);
            break;
        }
        case Utils.TiledObjectType.POLYGON: {
            var points = meta.polygon;
            var poses = points.map(function (p) {
                return new pixi_js_1.Point(p.x + meta.x, p.y + meta.y);
            });
            prim = new TiledPolygon(poses);
            break;
        }
        case Utils.TiledObjectType.POLYLINE: {
            var points = meta.polygon;
            var poses = points.map(function (p) {
                return new pixi_js_1.Point(p.x + meta.x, p.y + meta.y);
            });
            prim = new TiledPolypine(poses);
            break;
        }
        default:
            prim = new TiledRect(meta.x, meta.y, meta.width, meta.height);
    }
    prim.types = meta.type ? meta.type.split(":") : [];
    prim.visible = meta.visible;
    prim.name = meta.name;
    return prim;
}
exports.BuildPrimitive = BuildPrimitive;
//# sourceMappingURL=TiledPrimitives.js.map