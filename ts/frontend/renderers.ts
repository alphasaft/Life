import { Vector } from "../physics/vector";
import { Delayer } from "../util/classes";
import { Canvas } from "../util/aliases";
import { Camera } from "./camera"


export interface Renderer {
    readonly canvas: Canvas
    readonly camera: Camera

    addPoint(pos: Vector, radius: number, color: string, fadeoutDuration: number): void
    addText(x: number, y: number, text: string, color: string): void
    update(timelapse: number): void
}


export class Renderer2D implements Renderer {
    readonly canvas: Canvas
    readonly camera: Camera

    private delayer: Delayer

    constructor(canvas: Canvas, camera: Camera) {
        this.canvas = canvas
        this.camera = camera
        this.delayer = new Delayer()
    }

    addPoint(pos: Vector, radius: number, color: string) {
        this.delayer.delay(() => {
            let canvas = this.canvas
            let ctx = canvas.getContext("2d")!

            let relativePos = pos.sub(this.camera.center)
            let x = canvas.width / this.camera.width * relativePos.scalarProd(this.camera.ux)
            let y = canvas.height / this.camera.height * relativePos.scalarProd(this.camera.uy)
            let relativeX = canvas.width - (x + canvas.width/2)
            let relativeY = canvas.height - (y + canvas.height/2)
            let r = radius*this.camera.zoom

            ctx.fillStyle = color
            ctx.beginPath()
            ctx.ellipse(relativeX, relativeY, r, r, 0, 0, 2*Math.PI)
            ctx.fill()
        }, { priority: 0 })
    }

    addText(x: number, y: number, text: string, color: string): void {
        this.delayer.delay(() => {
            let ctx = this.canvas.getContext("2d")!
            ctx.fillStyle = color
            ctx.fillText(text, x, y)
        }, Delayer.MIN_PRIORITY) // Always display text on top
    }

    update(timelapse: number) {
        this.canvas.getContext("2d")!.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.delayer.force()
    }
}

export class Renderer3D implements Renderer {
    private readonly delayer: Delayer

    private readonly ctx: CanvasRenderingContext2D
    readonly canvas: Canvas
    readonly camera: Camera

    constructor(canvas: Canvas, camera: Camera) {
        this.delayer = new Delayer()

        this.ctx = canvas.getContext("2d")!
        this.canvas = canvas
        this.camera = camera
    }

    private project(pos: Vector): [number, number] | null {
        if (pos === null) return null

        let camera = this.camera
        let angle = Math.PI/4
        let projectionCenter = camera.center.sub(camera.uz.times(camera.width/Math.tan(angle)))
        let lensRadius = camera.width/Math.sin(angle)

        if (pos.sub(camera.center).scalarProd(camera.uz) < 0) return null

        let v = pos.sub(projectionCenter)
        let ux = camera.ux
        let uy = camera.uy
        let uz = camera.uz
        let theta = v.angle(uy)
        let psi = v.orthogonalProjection(uy).angle(ux)
        let projected = 
            ux.times(lensRadius*Math.sin(theta)*Math.cos(psi))
            .add(uy.times(lensRadius*Math.cos(theta)))
            .add(uz.times(lensRadius*Math.sin(theta)*Math.sin(psi)))

        let x = this.canvas.width / camera.width * projected.scalarProd(ux)
        let y = this.canvas.height / camera.height * projected.scalarProd(uy)

        return projected.scalarProd(uz) > 0 ? [
            Math.round(this.canvas.width - (x + this.canvas.width/2)),  
            Math.round(this.canvas.height - (y + this.canvas.height/2)), 
        ] : null
    }

    private scaleRadius(radius: number, pos: Vector): number {
        return radius / (Math.abs(pos.sub(this.camera.center).scalarProd(this.camera.uz)) + 1)
    }

    addPoint(pos: Vector, radius: number, color: string, fadeoutDuration: number): void {
        this.delayer.delay(() => {
            let projection = this.project(pos) 
            if (projection === null) return
            
            let [x,y] = projection
            let scaledRadius = this.scaleRadius(radius, pos) * this.camera.zoom

            this.ctx.fillStyle = color
            this.ctx.beginPath()
            this.ctx.ellipse(x, y, scaledRadius, scaledRadius, 0, 0, 2*Math.PI)
            this.ctx.fill()
        }, { priority: this.camera.center.sub(pos).norm2() })   
    }

    addText(x: number, y: number, text: string, color: string): void {
        this.delayer.delay(() => {
            this.ctx.fillStyle = color
            this.ctx.fillText(text, x, y)
        }, Delayer.MIN_PRIORITY)
    }

    update(timelapse: number): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.delayer.force()
    }
}

