
import { Universe } from "../physics/universe";
import { fillWithDefault } from "../util/functions";
import { Dynamic, get } from "./dynamic";
import { Renderer } from "./renderers";
import { Camera } from "./camera";


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
    private universe: Universe;
    private lastRendering: number;
    private settings: MainLoopSettings;
    private currentFrameHandle: number

    constructor(
        renderer: Renderer,
        system: Universe,
        settings: Partial<MainLoopSettings> = {},
    ) {
        this.renderer = renderer;
        this.universe = system;
        this.settings = fillWithDefault(settings, defaultMainLoopSettings)
    }

    run() {
        this.lastRendering = (new Date()).getTime();
        this.startClock();
    }

    stop() {
        window.cancelAnimationFrame(this.currentFrameHandle)
    }

    setSystem(system: Universe) {
        this.universe = system
    }

    getCanvas() {
        return this.renderer.canvas
    }

    getCamera(): Camera {
        return this.renderer.camera
    }

    setCamera(camera: Camera) {
        this.renderer.camera.copyState(camera)
    }

    private startClock() {
        this.currentFrameHandle = window.requestAnimationFrame(() => {
            this.update();
            this.startClock();
        });
    }

    private update() {
        let now = (new Date()).getTime();
        let totalTimelapse = (now - this.lastRendering) / 1000;
        let ticks = Math.round(totalTimelapse / Math.min(totalTimelapse, this.settings.tickDuration));
        this.lastRendering = now;

        for (let i = 0; i <= ticks; i++) {
            this.universe.update(totalTimelapse / ticks * get(this.settings.timeFactor));
        }
        
        this.universe.displayOn(this.renderer);
        this.renderer.update(totalTimelapse)
    }
}
