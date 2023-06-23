import { Vector } from "../physics/vector"
import { roundAt } from "../util/functions"


export class Camera {
    ux: Vector
    uy: Vector
    uz: Vector
    center: Vector
    width: number
    height: number
    zoom: number

    static standard(center: Vector, width: number, height: number): Camera {
        return new Camera(
            new Vector(1, 0, 0),
            new Vector(0, 1, 0),
            new Vector(0, 0, 1),
            center,
            width,
            height,
            1
        )
    }

    constructor(
        ux: Vector,
        uy: Vector,
        uz: Vector,
        center: Vector,
        width: number,
        height: number,
        zoom: number
    ) {
        this.ux = ux.unitary()
        this.uy = uy.unitary()
        this.uz = uz.unitary()
        this.center = center
        this.width = width
        this.height = height
        this.zoom = zoom
    }

    private rotate(uName: "ux" | "uy" | "uz", vName: "ux" | "uy" | "uz", angle: number) {
        let u = this[uName]
        let v = this[vName]
        this[uName] = u.times(Math.cos(angle)).add(v.times(Math.sin(angle)))
        this[vName] = v.times(Math.cos(angle)).add(u.times(-Math.sin(angle)))
    }

    rotateAroundX(angle: number) {
        this.rotate("uy", "uz", angle)
    }

    rotateAroundY(angle: number) {
        this.rotate("uz", "ux", angle)
    }

    rotateAroundZ(angle: number) {
        this.rotate("ux", "uy", angle)
    }

    private move(axis: Vector, movement: number) {
        this.center = this.center.add(axis.times(movement))
    }

    moveAlongX(movement: number) {
        this.move(this.ux, movement)
    }

    moveAlongY(movement: number) {
        this.move(this.uy, movement)
    }

    moveAlongZ(movement: number) {
        this.move(this.uz, movement)
    }

    zoomIn(zoom: number) {
        this.width = this.width/zoom
        this.height = this.height/zoom
        this.zoom *= zoom
    }

    copyState(camera: Camera) {
        this.ux = camera.ux
        this.uy = camera.uy
        this.uz = camera.uz
        this.center = camera.center
        this.width = camera.width
        this.height = camera.height
        this.zoom = camera.zoom
    }

    info(): string {
        let f = (x: number) => roundAt(x, 2)
        let stdUx = new Vector(1, 0, 0)
        let stdUy = new Vector(0, 1, 0)
        let theta = this.uy.angle(stdUy)
        let psi = this.ux.orthogonalProjection(stdUy).angle(stdUx)
        
        return (
            `x: ${f(this.center.x)}, y: ${f(this.center.y)}, z: ${f(this.center.z)} ` + 
            `[(y, y'): ${f(theta)} rads, (x, x'): ${f(psi)} rads] ` +
            `(zoom: ${f(this.zoom*100)}%)`  
        )
    }
}

