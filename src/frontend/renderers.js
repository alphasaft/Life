import { Vector } from "../physics/base";
import { Delayer } from "../util/classes";
export class Camera {
    static standard(width, height) {
        return new Camera(new Vector(1, 0, 0), new Vector(0, 1, 0), new Vector(0, 0, 1), new Vector(0, 0, 0), width, height);
    }
    constructor(ux, uy, uz, center, width, height) {
        this.ux = ux.unitary();
        this.uy = uy.unitary();
        this.uz = uz.unitary();
        this.center = center;
        this.width = width;
        this.height = height;
    }
    rotate(uName, vName, angle) {
        let u = this[uName];
        let v = this[vName];
        this[uName] = u.scalarMul(Math.cos(angle)).add(v.scalarMul(Math.sin(angle)));
        this[vName] = v.scalarMul(Math.cos(angle)).add(u.scalarMul(-Math.sin(angle)));
    }
    rotateAroundX(angle) {
        this.rotate("uy", "uz", angle);
    }
    rotateAroundY(angle) {
        this.rotate("uz", "ux", angle);
    }
    rotateAroundZ(angle) {
        this.rotate("ux", "uy", angle);
    }
    move(axis, movement) {
        console.log("Camera movement detected");
        this.center = this.center.add(axis.scalarMul(movement));
        console.log(this.center.toString());
    }
    moveAlongX(movement) {
        this.move(this.ux, movement);
    }
    moveAlongY(movement) {
        this.move(this.uy, movement);
    }
    moveAlongZ(movement) {
        this.move(this.uz, movement);
    }
    copyState(camera) {
        this.ux = camera.ux;
        this.uy = camera.uy;
        this.uz = camera.uz;
        this.center = camera.center;
        this.width = camera.width;
        this.height = camera.height;
    }
}
export class Renderer2D {
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        this.ctx = canvas.getContext("2d");
        this.delayer = new Delayer();
    }
    clear() {
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    }
    addPoint(pos, color, radius) {
        this.delayer.delay(() => {
            let relativePos = pos.sub(this.camera.center);
            let x = this.canvas.width / this.camera.width * relativePos.scalarProd(this.camera.ux);
            let y = this.canvas.height / this.camera.height * relativePos.scalarProd(this.camera.uy);
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
            this.ctx.fill();
        }, { priority: 0 });
    }
    render() {
        this.delayer.force();
    }
}
export class Renderer3D {
    constructor(canvas, camera) {
        this.delayer = new Delayer();
        this.camera = camera;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }
    clear() {
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    }
    project(pos) {
        if (pos === null)
            return null;
        let camera = this.camera;
        let angle = Math.PI / 4;
        let projectionCenter = camera.center.sub(camera.uz.scalarMul(camera.width / Math.tan(angle)));
        let lensRadius = camera.width / Math.sin(angle);
        if (pos.sub(camera.center).scalarProd(camera.uz) < 0)
            return null;
        let v = pos.sub(projectionCenter);
        let ux = camera.ux;
        let uy = camera.uy;
        let uz = camera.uz;
        let theta = v.angle(uy);
        let psi = v.projectOnto(ux, uz).angle(ux);
        let projected = ux.scalarMul(lensRadius * Math.sin(theta) * Math.cos(psi))
            .add(uy.scalarMul(lensRadius * Math.cos(theta)))
            .add(uz.scalarMul(lensRadius * Math.sin(theta) * Math.sin(psi)));
        let x = this.canvas.width / camera.width * projected.scalarProd(ux);
        let y = this.canvas.height / camera.height * projected.scalarProd(uy);
        return projected.scalarProd(uz) > 0 ? [
            this.canvas.width - (x + this.canvas.width / 2),
            this.canvas.height - (y + this.canvas.height / 2),
        ] : null;
    }
    scaleRadius(radius, pos) {
        return radius / (Math.abs(pos.sub(this.camera.center).scalarProd(this.camera.uz)) + 1);
    }
    addPoint(pos, color, radius) {
        this.delayer.delay(() => {
            let projection = this.project(pos);
            if (projection === null)
                return;
            let [x, y] = projection;
            let scaledRadius = this.scaleRadius(radius, pos);
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, scaledRadius, scaledRadius, 0, 0, 2 * Math.PI);
            this.ctx.fill();
        }, { priority: -pos.z });
    }
    render() {
        this.delayer.force();
    }
}
function withTrailing(space) {
    return class WithTrailingMixin extends space {
        constructor(canvas, camera, trailCoeff) {
            super(canvas, camera);
            this.trailCoeff = trailCoeff;
        }
        clear() {
            let ctx = this.canvas.getContext("2d");
            ctx.fillStyle = "rgb(255,255,255," + (1 - this.trailCoeff).toString() + ")";
            ctx.beginPath();
            ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            ctx.fill();
        }
    };
}
function noClear(space) {
    return class NoClearMixin extends space {
        clear() { }
    };
}
export const Renderer2DWithTrailing = withTrailing(Renderer2D);
export const Renderer2DNoClear = noClear(Renderer2D);
export const Renderer3DWithTrailing = withTrailing(Renderer3D);
export const Renderer3DNoClear = noClear(Renderer3D);
//# sourceMappingURL=renderers.js.map