declare module "pixi.js" {
    namespace utils {
        interface EventEmitter {
            onceAsynce(event: string): Promise<any>;
        }
    }
}
export default function (): void;
