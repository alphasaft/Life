import { Force, Action } from "./force"
import { Renderer } from "../frontend/renderers"
import { Vector, vectorialSum } from "./base"
import { sumBy, fillWithDefault } from "../util/functions"


export type PointStyle = {
	color: string
	radius: number
}

export type IncompletePhysicalProperties = Partial<PhysicalProperties> & { mass: number }
export type PhysicalProperties = {
	mass: number,
	charge: number
}

const defaultProperties: PhysicalProperties = {
	mass: undefined, 
	charge: 0,
}

const defaultPointStyle: PointStyle = {
	color: "black",
	radius: 10,
}



export interface PhysicalObject {
	generateForces(): Force[]
    update(globalForce: Force, timelapse: number): void
	drawOn(space: Renderer): void
}

export class Universe implements PhysicalObject {
	private globalForces: Force[]

	constructor(...globalForces: Force[]) {
		this.globalForces = globalForces
	}

	generateForces(): Force[] { return this.globalForces }
	update(_globalForce: Force, _timelapse: number) {}
	drawOn(_space: Renderer): void {}
}



export class Point implements PhysicalObject {
	pos: Vector
	speed: Vector
	properties: PhysicalProperties
	style: PointStyle
	private actions: Action[]

	constructor(
		pos: Vector,
		speed: Vector = new Vector(0,0,0),
		properties: IncompletePhysicalProperties,
		{ actions, style }: {
			actions: Action[],
			style: Partial<PointStyle>
		} = { actions: [], style: {} }
	) {
		this.pos = pos
		this.speed = speed
		this.properties = fillWithDefault(properties, defaultProperties)
		this.style = fillWithDefault(style, defaultPointStyle)
		this.actions = actions
	}

	get mass() {
		return this.properties.mass
	}

	generateForces(): Force[] {
		return this.actions.map(action => action.from(this))
	}
	
	appliedAcceleration(force: Force): Vector {
		return force.expression(this).scalarMul(1/this.properties.mass)
	}

	getMovementQuantity() {
		return this.speed.scalarMul(this.properties.mass)
	}

	update(globalForce: Force, timelapse: number) {
		let acceleration = this.appliedAcceleration(globalForce)
		this.pos = this.pos.add(this.speed.scalarMul(timelapse))
		this.speed = this.speed.add(acceleration.scalarMul(timelapse))
	}
	
	drawOn(space: Renderer) {
		space.addPoint(this.pos, this.style.color, this.style.radius)
	}
}


export class RigidLinks implements PhysicalObject {
    private points: Point[]
	private totalMass: number
	private barycenterPos: Vector 
	private barycenterSpeed: Vector
	private kineticMoment: Vector
	private inertialMoment: number

    constructor(...points: Point[]) {
        this.points = points
		this.totalMass = sumBy(points, (p) => p.properties.mass)
		this.barycenterPos = vectorialSum(points.map((p) => p.pos.scalarMul(p.mass))).scalarMul(1/this.totalMass)
		this.barycenterSpeed = vectorialSum(points.map((p) => p.speed.scalarMul(p.mass))).scalarMul(1/this.totalMass)
		this.kineticMoment = points.map((p) => p.getMovementQuantity().vectorProd(p.pos.sub(this.barycenterPos))).reduce((a,b) => a.add(b))
		this.inertialMoment = sumBy(points, p => p.mass * (p.pos.sub(this.barycenterPos)).norm()**2)
    }

	private GM(M: Point): Vector {
		return M.pos.sub(this.barycenterPos)
	}

	update(globalForce: Force, timelapse: number): void {
		let forcesOnPoints = this.points.map(p => p.appliedAcceleration(globalForce).scalarMul(p.mass))

		let barycenterAcceleration = vectorialSum(forcesOnPoints).scalarMul(1/this.totalMass)
		this.barycenterSpeed = this.barycenterSpeed.add(barycenterAcceleration.scalarMul(timelapse))
		this.barycenterPos = this.barycenterPos.add(this.barycenterSpeed.scalarMul(timelapse))

		let moment = vectorialSum(forcesOnPoints.map((f, i) => this.GM(this.points[i]).vectorProd(f).scalarMul(this.points[i].mass)))
		this.kineticMoment = this.kineticMoment.add(moment.scalarMul(timelapse))
		let rotationVector = this.kineticMoment.scalarMul(1/this.inertialMoment)
		for (let point of this.points) {
			point.speed = this.barycenterSpeed.add(rotationVector.vectorProd(this.GM(point)))
			point.pos = point.pos.add(point.speed.scalarMul(timelapse))
		}
	}

	drawOn(space: Renderer): void {
		this.points.forEach(p => p.drawOn(space))
	}

	generateForces(): Force[] {
		return this.points.flatMap(p => p.generateForces())
	}
}
