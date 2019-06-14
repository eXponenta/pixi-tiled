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
var KeyInputHandler = (function () {
    function KeyInputHandler() {
    }
    KeyInputHandler.upHandler = function (e) {
        e.preventDefault();
        KeyInputHandler.IsKeyDown[e.keyCode] = false;
        KeyInputHandler.events.emit("keyup", e);
    };
    KeyInputHandler.downHandler = function (e) {
        e.preventDefault();
        KeyInputHandler.IsKeyDown[e.keyCode] = true;
        KeyInputHandler.events.emit("keydown", e);
    };
    KeyInputHandler.focusOut = function (e) {
        KeyInputHandler.IsKeyDown = [];
    };
    KeyInputHandler.BindKeyHandler = function (dom) {
        KeyInputHandler.latestDom = dom;
        dom.addEventListener("keydown", KeyInputHandler.downHandler);
        dom.addEventListener("keyup", KeyInputHandler.upHandler);
        dom.addEventListener("blur", KeyInputHandler.focusOut);
    };
    KeyInputHandler.ReleaseKeyHandler = function () {
        if (KeyInputHandler.latestDom) {
            KeyInputHandler.latestDom.removeEventListener("keydown", KeyInputHandler.downHandler);
            KeyInputHandler.latestDom.removeEventListener("keyup", KeyInputHandler.upHandler);
            KeyInputHandler.latestDom.removeEventListener("blur", KeyInputHandler.focusOut);
            KeyInputHandler.latestDom = undefined;
        }
        KeyInputHandler.IsKeyDown = [];
        KeyInputHandler.events.removeAllListeners();
    };
    KeyInputHandler.IsKeyDown = [];
    KeyInputHandler.events = new PIXI.utils.EventEmitter();
    return KeyInputHandler;
}());
exports.KeyInputHandler = KeyInputHandler;
//# sourceMappingURL=InputHandler.js.map