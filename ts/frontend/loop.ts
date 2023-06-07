
import { PhysicalSystem } from "../physics/system";
import { fillWithDefault } from "../util/functions";
import { Dynamic, get } from "./dynamic";
import { Camera, Renderer } from "./renderers";


export type MainLoopSettings = {
    tickDuration: number
    timeFactor: Dynamic<number>
}

const defaultMainLoopSettings: MainLoopSettings = {
    tickDuration: 0.000001,
    timeFactor: 1
}


export class MainLoop {
    private renderer: Renderer;
    private system: PhysicalSystem;
    private lastRendering: number;
    private settings: MainLoopSettings;
    private currentFrameHandle: number

    constructor(
        renderer: Renderer,
        system: PhysicalSystem,
        settings: Partial<MainLoopSettings> = {},
    ) {
        this.renderer = renderer;
        this.system = system;
        this.settings = fillWithDefault(settings, defaultMainLoopSettings)
    }

    run() {
        this.lastRendering = (new Date()).getTime();
        this.startClock();
    }

    stop() {
        window.cancelAnimationFrame(this.currentFrameHandle)
    }

    setSystem(system: PhysicalSystem) {
        this.system = system
    }

    getCanvas() {
        return this.renderer.canvas
    }

    getCamera(): Camera {
        return this.renderer.camera
    }

    setCamera(camera: Camera) {
        this.renderer.camera = camera
    }

    private startClock() {
        this.currentFrameHandle = window.requestAnimationFrame(() => {
            this.update();
            this.startClock();
        });
    }

    private update() {
        let now = (new Date()).getTime();
        let elapsedSecs = (now - this.lastRendering) / 1000;
        let ticks = Math.round(elapsedSecs / Math.min(elapsedSecs, this.settings.tickDuration));
        this.lastRendering = now;
        for (let i = 0; i <= ticks; i++) {
            this.system.update(elapsedSecs / ticks * get(this.settings.timeFactor));
        }
        this.renderer.clear();
        this.system.drawOn(this.renderer);
        this.renderer.render()
    }
}
