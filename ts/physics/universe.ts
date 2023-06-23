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
		this.actions.forEach(action => {
			let possibleArguments = this.collectArguments(action.arity, p => action.target.contains(p) )
			possibleArguments.forEach(args => action.execute(args, timelapse))
		})
		this.points.forEach(p => p.update(timelapse))
	}

	private collectArguments(arity: number, predicate: (p: Point) => boolean): Point[][] {
		let validPoints = this.points.filter(predicate)
		let collect: (arity: number) => Point[][] = arity => {
			if (arity === 0) return [[]]
			return validPoints.flatMap(p => collect(arity-1)
				.filter(args => !args.includes(p))
				.map(args => args.concat(p))
			)
		}
		return collect(arity)
	}

	displayOn(space: Renderer) {
		this.graphics.forEach(g => g.display(this.points, space))
	}
}

