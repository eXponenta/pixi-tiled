declare module "pixi.js" {
    namespace utils {
        interface EventEmitter {
            onceAsync(event: string, context?: any): Promise<any>;
        }
    }
}
export default function (pack: {
    utils: any;
}): void;
