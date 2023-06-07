import { Vector } from "../physics/base";
import { Delayer } from "../util";
import { get } from "./dynamic";
function axisSize(axis) {
    return axis[1] - axis[0];
}
function rescaleAlongAxis(x, axis, width) {
    return width * (x - axis[0]) / (axis[1] - axis[0]);
}
export class Screen {
    static standard(width, height) {
        return new Screen(new Vector(1, 0, 0), new Vector(0, 1, 0), new Vector(0, 0, 1), new Vector(0, 0, 0), width, height);
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
    copyState(screen) {
        this.ux = screen.ux;
        this.uy = screen.uy;
        this.uz = screen.uz;
        this.center = screen.center;
        this.width = screen.width;
        this.height = screen.height;
    }
}
export class Space2D {
    constructor(canvas, axes) {
        this.axes = axes;
        this.canvas = canvas;
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
            let x = pos.x;
            let y = pos.y;
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            let xCoord = rescaleAlongAxis(x, this.axes[0], this.canvas.width);
            let yCoord = rescaleAlongAxis(y, this.axes[1], this.canvas.width);
            this.ctx.ellipse(xCoord, yCoord, radius, radius, 0, 0, 2 * Math.PI);
            this.ctx.fill();
        }, { priority: 0 });
    }
    render() {
        this.delayer.force();
    }
}
export class Space3D {
    constructor(canvas, screen) {
        this.delayer = new Delayer();
        this.screen = screen;
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
        let screen = this.screen;
        let angle = Math.PI / 4;
        let projectionCenter = screen.center.sub(screen.uz.scalarMul(screen.width / Math.tan(angle)));
        let lensRadius = screen.width / Math.sin(angle);
        if (pos.sub(screen.center).scalarProd(screen.uz) < 0)
            return null;
        let v = pos.sub(projectionCenter);
        let ux = screen.ux;
        let uy = screen.uy;
        let uz = screen.uz;
        let theta = v.angle(uy);
        let psi = v.projectOnto(ux, uz).angle(ux);
        let projected = ux.scalarMul(lensRadius * Math.sin(theta) * Math.cos(psi))
            .add(uy.scalarMul(lensRadius * Math.cos(theta)))
            .add(uz.scalarMul(lensRadius * Math.sin(theta) * Math.sin(psi)));
        let x = this.canvas.width / screen.width * projected.scalarProd(ux);
        let y = this.canvas.height / screen.height * projected.scalarProd(uy);
        return projected.scalarProd(uz) > 0 ? [
            this.canvas.width - (x + this.canvas.width / 2),
            this.canvas.height - (y + this.canvas.height / 2),
        ] : null;
    }
    scaleRadius(radius, pos) {
        let screen = get(this.screen);
        return radius / (Math.abs(pos.sub(screen.center).scalarProd(screen.uz)) + 1);
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
        constructor(canvas, axes, trailCoeff) {
            super(canvas, axes);
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
export const PlaneWithTrailing = withTrailing(Space2D);
export const PlaneNoClear = noClear(Space2D);
//# sourceMappingURL=space.js.map