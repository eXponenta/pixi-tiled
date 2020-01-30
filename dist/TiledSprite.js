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
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var TiledSprite = (function (_super) {
    __extends(TiledSprite, _super);
    function TiledSprite() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TiledSprite;
}(pixi_js_1.Sprite));
exports.TiledSprite = TiledSprite;
//# sourceMappingURL=TiledSprite.js.map