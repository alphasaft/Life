import { Action } from "./actions"
import { Renderer } from "../frontend/renderers"
import { GraphicItem } from "./graphics"
import { Point } from "./point"



export class Universe {
	points: Point[]
	actions: Action[]
	graphics: GraphicItem[]

	constructor(points: Point[], actions: Action[], graphics: GraphicItem[]) {
		this.points = points
		this.actions = actions.slice().sort((a1, a2) => a1.type.priority - a2.type.priority)
		this.graphics = graphics
	}
	
	update(timelapse: number) {
		this.actions.forEach(action => action.execute(this.points, timelapse))
		this.points.forEach(p => p.update(timelapse))
	}

	displayOn(space: Renderer) {
		this.graphics.forEach(g => g.display(this.points, space))
	}
}

