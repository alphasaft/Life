import { Vector } from "./base"
import { Force } from "./force"
import { Item, Universe } from "./objects"
import { Renderer } from "../frontend/renderers"



export class PhysicalSystem {
	items: Item[]

	constructor(objects: Item[]) {
		this.items = objects
	}
	
	update(timelapse: number) {
		let forces = this.items.map((o) => o.generateForces()).flat()
        let globalForce = new Force(point => forces.map(f => f.expression(point)).reduce((a,b) => a.add(b), Vector.zero))
        this.items.forEach(it => it.update(globalForce, timelapse))
	}

	drawOn(space: Renderer) {
		this.items.forEach((it) => {
			it.drawOn(space)
		})
	}
}

