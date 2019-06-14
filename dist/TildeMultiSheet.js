"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MultiSpritesheet = (function () {
    function MultiSpritesheet(sheets) {
        var _this = this;
        this.sheets = [];
        this.images = {};
        if (sheets) {
            sheets.forEach(function (element) {
                _this.add(element);
            });
        }
    }
    MultiSpritesheet.prototype.add = function (sheet) {
        if (!sheet)
            throw "Sheet can't be undefined";
        this.sheets.push(sheet);
    };
    MultiSpritesheet.prototype.addTexture = function (tex, id) {
        this.images[id] = tex;
    };
    Object.defineProperty(MultiSpritesheet.prototype, "textures", {
        get: function () {
            var map = {};
            for (var _i = 0, _a = this.sheets; _i < _a.length; _i++) {
                var spr = _a[_i];
                Object.assign(map, spr.textures);
            }
            Object.assign(map, this.images);
            return map;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiSpritesheet.prototype, "animations", {
        get: function () {
            var map = {};
            for (var _i = 0, _a = this.sheets; _i < _a.length; _i++) {
                var spr = _a[_i];
                Object.assign(map, spr.animations);
            }
            return map;
        },
        enumerable: true,
        configurable: true
    });
    return MultiSpritesheet;
}());
exports.default = MultiSpritesheet;
//# sourceMappingURL=TildeMultiSheet.js.map