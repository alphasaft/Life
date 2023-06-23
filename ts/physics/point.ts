import { fillWithDefault } from "../util/functions"
import { Vector } from "./vector"



export type PointID = string
export type IncompletePhysicalProperties = Partial<PhysicalProperties> & { mass: number }
export type PhysicalProperties = {
	mass: number,
	charge: number
}

export class Point {
    id: PointID
	pos: Vector
	speed: Vector
	properties: PhysicalProperties

    static defaultProperties: PhysicalProperties = {
        mass: 1,
        charge: 0,
    }

	constructor(
        id: PointID,
		pos: Vector,
		speed: Vector,
		properties: IncompletePhysicalProperties,
	) {
        this.id = id
		this.pos = pos
		this.speed = speed
		this.properties = fillWithDefault(properties, Point.defaultProperties)
	}

	get mass() {
		return this.properties.mass
	}

	get movementQuantity() {
		return this.speed.times(this.properties.mass)
	}

    setSpeed(speed: Vector) {
        this.speed = speed
    }
    
    addSpeed(speed: Vector) {
        this.speed = this.speed.add(speed)
    }

    update(timelapse: number) {
        this.pos = this.pos.add(this.speed.times(timelapse))
    }
}