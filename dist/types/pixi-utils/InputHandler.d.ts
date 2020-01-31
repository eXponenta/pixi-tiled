import * as PIXI from 'pixi.js';
export declare class KeyInputHandler {
    static IsKeyDown: Array<boolean>;
    static events: PIXI.utils.EventEmitter;
    private static latestDom;
    private static upHandler;
    private static downHandler;
    private static focusOut;
    static BindKeyHandler(dom: HTMLElement | Window): void;
    static ReleaseKeyHandler(): void;
}
