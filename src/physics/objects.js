import { Vector, vectorialSum } from "./base";
import { sumBy, fillWithDefault } from "../util/functions";
const defaultProperties = {
    mass: undefined,
    charge: 0,
};
const defaultPointStyle = {
    color: "black",
    radius: 10,
};
export class Universe {
    constructor(...globalForces) {
        this.globalForces = globalForces;
    }
    generateForces() { return this.globalForces; }
    update(_globalForce, _timelapse) { }
    drawOn(_space) { }
}
export class Point {
    constructor(pos, speed = new Vector(0, 0, 0), properties, { actions, style } = { actions: [], style: {} }) {
        this.pos = pos;
        this.speed = speed;
        this.properties = fillWithDefault(properties, defaultProperties);
        this.style = fillWithDefault(style, defaultPointStyle);
        this.actions = actions;
    }
    get mass() {
        return this.properties.mass;
    }
    generateForces() {
        return this.actions.map(action => action.from(this));
    }
    appliedAcceleration(force) {
        return force.expression(this).scalarMul(1 / this.properties.mass);
    }
    getMovementQuantity() {
        return this.speed.scalarMul(this.properties.mass);
    }
    update(globalForce, timelapse) {
        let acceleration = this.appliedAcceleration(globalForce);
        this.pos = this.pos.add(this.speed.scalarMul(timelapse));
        this.speed = this.speed.add(acceleration.scalarMul(timelapse));
    }
    drawOn(space) {
        space.addPoint(this.pos, this.style.color, this.style.radius);
    }
}
export class RigidLinks {
    constructor(...points) {
        this.points = points;
        this.totalMass = sumBy(points, (p) => p.properties.mass);
        this.barycenterPos = vectorialSum(points.map((p) => p.pos.scalarMul(p.mass))).scalarMul(1 / this.totalMass);
        this.barycenterSpeed = vectorialSum(points.map((p) => p.speed.scalarMul(p.mass))).scalarMul(1 / this.totalMass);
        this.kineticMoment = points.map((p) => p.getMovementQuantity().vectorProd(p.pos.sub(this.barycenterPos))).reduce((a, b) => a.add(b));
        this.inertialMoment = sumBy(points, p => p.mass * Math.pow((p.pos.sub(this.barycenterPos)).norm(), 2));
    }
    GM(M) {
        return M.pos.sub(this.barycenterPos);
    }
    update(globalForce, timelapse) {
        let forcesOnPoints = this.points.map(p => p.appliedAcceleration(globalForce).scalarMul(p.mass));
        let barycenterAcceleration = vectorialSum(forcesOnPoints).scalarMul(1 / this.totalMass);
        this.barycenterSpeed = this.barycenterSpeed.add(barycenterAcceleration.scalarMul(timelapse));
        this.barycenterPos = this.barycenterPos.add(this.barycenterSpeed.scalarMul(timelapse));
        let moment = vectorialSum(forcesOnPoints.map((f, i) => this.GM(this.points[i]).vectorProd(f).scalarMul(this.points[i].mass)));
        this.kineticMoment = this.kineticMoment.add(moment.scalarMul(timelapse));
        let rotationVector = this.kineticMoment.scalarMul(1 / this.inertialMoment);
        for (let point of this.points) {
            point.speed = this.barycenterSpeed.add(rotationVector.vectorProd(this.GM(point)));
            point.pos = point.pos.add(point.speed.scalarMul(timelapse));
        }
    }
    drawOn(space) {
        this.points.forEach(p => p.drawOn(space));
    }
    generateForces() {
        return this.points.flatMap(p => p.generateForces());
    }
}
//# sourceMappingURL=objects.js.map