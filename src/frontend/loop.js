import { fillWithDefault } from "../util/functions";
import { get } from "./dynamic";
const defaultMainLoopSettings = {
    tickDuration: 0.000001,
    timeFactor: 1
};
export class MainLoop {
    constructor(renderer, system, settings = {}) {
        this.renderer = renderer;
        this.system = system;
        this.settings = fillWithDefault(settings, defaultMainLoopSettings);
    }
    run() {
        this.lastRendering = (new Date()).getTime();
        this.startClock();
    }
    stop() {
        window.cancelAnimationFrame(this.currentFrameHandle);
    }
    setSystem(system) {
        this.system = system;
    }
    getCanvas() {
        return this.renderer.canvas;
    }
    getCamera() {
        return this.renderer.camera;
    }
    setCamera(camera) {
        this.renderer.camera = camera;
    }
    startClock() {
        this.currentFrameHandle = window.requestAnimationFrame(() => {
            this.update();
            this.startClock();
        });
    }
    update() {
        let now = (new Date()).getTime();
        let elapsedSecs = (now - this.lastRendering) / 1000;
        let ticks = Math.round(elapsedSecs / Math.min(elapsedSecs, this.settings.tickDuration));
        this.lastRendering = now;
        for (let i = 0; i <= ticks; i++) {
            this.system.update(elapsedSecs / ticks * get(this.settings.timeFactor));
        }
        this.renderer.clear();
        this.system.drawOn(this.renderer);
        this.renderer.render();
    }
}
//# sourceMappingURL=loop.js.map