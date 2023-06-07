import { Vector } from "../physics/base";
import { Delayer } from "../util/classes";
import { Canvas } from "../util/aliases";
import { Camera } from "./camera"


export interface Renderer {
    readonly canvas: Canvas
    camera: Camera

    clear(): void
    addPoint(pos: Vector, color: string, radius: number): void
    addText(x: number, y: number, text: string, color: string): void
    render(): void
}

export class Renderer2D implements Renderer {
    readonly canvas: Canvas
    camera: Camera
    private ctx: CanvasRenderingContext2D
    private delayer: Delayer

    constructor(canvas: Canvas, camera: Camera) {
        this.canvas = canvas
        this.camera = camera
        this.ctx = canvas.getContext("2d")
        this.delayer = new Delayer()
    }

    clear() {
        this.ctx.fillStyle = "white"
        this.ctx.beginPath()
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fill()
    }

    addPoint(pos: Vector, color: string, radius: number) {
        this.delayer.delay(() => {
            let relativePos = pos.sub(this.camera.center)
            let x = this.canvas.width / this.camera.width * relativePos.scalarProd(this.camera.ux)
            let y = this.canvas.height / this.camera.height * relativePos.scalarProd(this.camera.uy)
            let r = radius*this.camera.zoom

            this.ctx.fillStyle = color
            this.ctx.beginPath()
            this.ctx.ellipse(x, y, r, r, 0, 0, 2*Math.PI)
            this.ctx.fill()
        }, { priority: 0 })
    }

    addText(x: number, y: number, text: string, color: string): void {
        this.ctx.font = "20px Arial"
        this.ctx.fillStyle = color
        this.ctx.fillText(text, x, y)
    }

    render() {
        this.delayer.force()
    }
}



export class Renderer3D implements Renderer {
    private delayer: Delayer
    private ctx: CanvasRenderingContext2D

    readonly canvas: Canvas
    camera: Camera

    constructor(canvas: Canvas, camera: Camera) {
        this.delayer = new Delayer()
        this.camera = camera
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
    }

    clear(): void {
        this.ctx.fillStyle = "white"
        this.ctx.beginPath()
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fill()
    }

    private project(pos: Vector): [number, number] | null {
        if (pos === null) return null

        let camera = this.camera
        let angle = Math.PI/4
        let projectionCenter = camera.center.sub(camera.uz.scalarMul(camera.width/Math.tan(angle)))
        let lensRadius = camera.width/Math.sin(angle)

        if (pos.sub(camera.center).scalarProd(camera.uz) < 0) return null

        let v = pos.sub(projectionCenter)
        let ux = camera.ux
        let uy = camera.uy
        let uz = camera.uz
        let theta = v.angle(uy)
        let psi = v.projectOnto(ux, uz).angle(ux)
        let projected = 
            ux.scalarMul(lensRadius*Math.sin(theta)*Math.cos(psi))
            .add(uy.scalarMul(lensRadius*Math.cos(theta)))
            .add(uz.scalarMul(lensRadius*Math.sin(theta)*Math.sin(psi)))

        let x = this.canvas.width / camera.width * projected.scalarProd(ux)
        let y = this.canvas.height / camera.height * projected.scalarProd(uy)

        return projected.scalarProd(uz) > 0 ? [
            this.canvas.width - (x + this.canvas.width/2),  
            this.canvas.height - (y + this.canvas.height/2), 
        ] : null
    }

    private scaleRadius(radius: number, pos: Vector): number {
        return radius / (Math.abs(pos.sub(this.camera.center).scalarProd(this.camera.uz)) + 1)
    }

    addPoint(pos: Vector, color: string, radius: number): void {
        this.delayer.delay(() => {
            let projection = this.project(pos) 
            if (projection === null) return
            
            let [x,y] = projection
            let scaledRadius = this.scaleRadius(radius, pos) * this.camera.zoom

            this.ctx.fillStyle = color
            this.ctx.beginPath()
            this.ctx.ellipse(x, y, scaledRadius, scaledRadius, 0, 0, 2*Math.PI)
            this.ctx.fill()
        }, { priority: -pos.z })
    }

    addText(x: number, y: number, text: string, color: string): void {
        this.ctx.fillStyle = color
        this.ctx.fillText(text, x, y)
    }

    render(): void {
        this.delayer.force()
    }
}


type SpaceClass = new (canvas: Canvas, camera: Camera) => Renderer


function withTrailing(space: SpaceClass) : new (canvas: Canvas, camera: Camera, trailCoeff: number) => Renderer {
    return class WithTrailingMixin extends space {
        private trailCoeff: number

        constructor(canvas: Canvas, camera: Camera, trailCoeff: number) {
            super(canvas, camera)
            this.trailCoeff = trailCoeff
        }

        clear(): void {
            let ctx = this.canvas.getContext("2d")
            ctx.fillStyle = "rgb(255,255,255," + (1-this.trailCoeff).toString() + ")"
            ctx.beginPath()
            ctx.rect(0, 0, this.canvas.width, this.canvas.height)
            ctx.fill()
        }
    }
}


function noClear(space: SpaceClass): SpaceClass {
    return class NoClearMixin extends space {
        clear(): void {}
    }
}


export const Renderer2DWithTrailing = withTrailing(Renderer2D)
export const Renderer2DNoClear = noClear(Renderer2D)
export const Renderer3DWithTrailing = withTrailing(Renderer3D)
export const Renderer3DNoClear = noClear(Renderer3D)

