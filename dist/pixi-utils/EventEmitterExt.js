"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(pack) {
    if (!pack.utils)
        throw new Error("Cant't find utils in package!");
    pack.utils.EventEmitter.prototype.onceAsync = function (event, context) {
        var _this = this;
        return new Promise(function (res) {
            _this.once(event, res, context);
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=EventEmitterExt.js.map