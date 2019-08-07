"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(pack) {
    if (!pack.DisplayObject)
        throw new Error("Cant't find DisplayObject in package!");
    pack.DisplayObject.prototype.replaceWithTransform = function (from) {
        from.updateTransform();
        if (from.parent) {
            from.parent.addChildAt(this, from.parent.getChildIndex(from));
        }
        this.pivot.copyFrom(from.pivot);
        this.position.copyFrom(from.position);
        this.scale.copyFrom(from.scale);
        this.rotation = from.rotation;
        this.updateTransform();
    };
}
exports.default = default_1;
//# sourceMappingURL=DisplayExt.js.map