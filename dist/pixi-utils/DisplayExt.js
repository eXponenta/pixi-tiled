"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
function default_1() {
    pixi_js_1.DisplayObject.prototype.replaceWithTransform = function (from) {
        from.updateTransform();
        if (from.parent)
            from.parent.addChildAt(this, from.parent.getChildIndex(from));
        this.position.copyFrom(from.position);
        this.scale.copyFrom(from.scale);
        this.rotation = from.rotation;
        this.updateTransform();
    };
}
exports.default = default_1;
//# sourceMappingURL=DisplayExt.js.map