import { Vector } from "./base"
import { Force } from "./force"
import { PhysicalObject } from "./objects"
import { Renderer } from "../frontend/renderers"



export class PhysicalSystem {
	objects: PhysicalObject[]

	constructor(objects: PhysicalObject[]) {
		this.objects = objects
	}
	
	update(timelapse: number) {
		let forces = this.objects.map((o) => o.generateForces()).flat()
        let globalForce = new Force(point => forces.map(f => f.expression(point)).reduce((a,b) => a.add(b), Vector.zero))
        this.objects.forEach(it => it.update(globalForce, timelapse))
	}

	drawOn(space: Renderer) {
		this.objects.forEach((it) => {
			it.drawOn(space)
		})
	}
}

