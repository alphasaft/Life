import { Renderer } from "../frontend/renderers";
import { fillWithDefault } from "../util/functions";
import { Point, PointID } from "./point";



export interface GraphicItem {
    display(allPoints: Point[], renderer: Renderer): void
}


export type PointStyle = { radius: number, color: string }

export class PointGraphic implements GraphicItem {
    private idRegex: RegExp
    private style: PointStyle
    private fadeoutDuration: number

    static defaultPointStyle: PointStyle = { radius: 10, color: "black" }

    constructor(idRegex: string, style: Partial<PointStyle> = {}, fadeoutDuration: number = 0) {
        this.idRegex = new RegExp(`^${idRegex}$`)
        this.style = fillWithDefault(style, PointGraphic.defaultPointStyle)
        this.fadeoutDuration = fadeoutDuration
    }

    display(allPoints: Point[], renderer: Renderer): void {
        allPoints.filter(p => this.idRegex.test(p.id)).forEach(p => {
            renderer.addPoint(p.pos, this.style.radius, this.style.color, this.fadeoutDuration)
        })
    }
}

export type PlaneStyle = { color: string, filled: boolean }



export class CameraInfo implements GraphicItem {
	display(allPoints: Point[], renderer: Renderer): void {
		let camera = renderer.camera
		let canvas = renderer.canvas
		let info = camera.info()
		renderer.addText(canvas.width - 4.3 * info.length, canvas.height - 10, info, "black")
	}
}
