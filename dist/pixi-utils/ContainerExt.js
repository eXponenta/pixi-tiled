"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = __importStar(require("pixi.js"));
function default_1() {
    PIXI.Container.prototype.getChildByPath = function (path) {
        if (!this.children || this.children.length == 0)
            return undefined;
        var result = this;
        var split = path.split("/");
        var isIndex = new RegExp("(?:{{0})-?d+(?=})");
        for (var _i = 0, split_1 = split; _i < split_1.length; _i++) {
            var p = split_1[_i];
            if (result == undefined || !(result.children)) {
                result = undefined;
                break;
            }
            if (p.trim().length == 0)
                continue;
            var ch = result.children;
            var mathes = p.match(isIndex);
            if (mathes) {
                var index = parseInt(mathes[0]);
                if (index < 0) {
                    index += ch.length;
                }
                if (index >= ch.length) {
                    result = undefined;
                }
                else {
                    result = ch[index];
                }
                continue;
            }
            result = result.getChildByName(p);
        }
        return result;
    };
    PIXI.Container.prototype.addGlobalChild = function () {
        var child = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            child[_i] = arguments[_i];
        }
        this.transform.updateLocalTransform();
        var loc = new PIXI.Matrix();
        var invert = this.transform.localTransform.clone().invert();
        for (var i = 0; i < child.length; i++) {
            var newChild = child[i];
            newChild.transform.updateLocalTransform();
            loc.copyFrom(invert);
            loc.append(newChild.localTransform);
            child[i].transform.setFromMatrix(loc);
        }
        return this.addChild.apply(this, child);
    };
}
exports.default = default_1;
//# sourceMappingURL=ContainerExt.js.map