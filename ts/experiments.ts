import { Vector } from "./physics/vector";
import { CameraInfo, PointGraphic } from "./physics/graphics";
import { Point } from "./physics/point";
import { Universe } from "./physics/universe";
import { ActionType, WholeSpace, Action, CuboidArea } from "./physics/actions";
import { RectContact, SphereContact } from "./physics/contact";
import { range } from "./util/functions";
import { OptimizedExperimentalStringConstraint, StringConstraint } from "./physics/structures";
import { Force, Interaction } from "./physics/forces";


export function donutExperiment(): Universe {
	const g = 9.81

	const actions: Action[] = [
		new Force(
			WholeSpace,
			(p) => Vector.uy.times(-g*p.mass)
		),
		new SphereContact(
			new Vector(0, 0, 2),
			3,
			0.1,
			{ restitution: 105, friction: 0 }
		),
		{
			type: ActionType.CorrectiveAction,
			execute(points: Point[], _timelapse: number) {
				for (let p of points) {
					if (p.pos.y < -4.8 && p.speed.norm2() < 0.05) {
						p.setSpeed(Vector.zero)
					}
				}
			}
		}
	]

	let angles = Array.from(range(18)).map(i => (i-9)*20*Math.PI/180)
	let i = 1
	const donut: Point[] = Array.from(range(40)).map(i => i*Math.PI/20).flatMap(a => {
		let vector = Vector.ux.times(Math.cos(a)).add(Vector.uz.times(Math.sin(a))) 
		return angles.map(b =>
			new Point(
				b <= Math.PI/3 && -Math.PI/3 <= b ? `topping-${i++}` : `cake-${i++}`, 
				vector.add(vector.times(Math.sin(b)).add(Vector.uy.times(Math.cos(b))).times(0.5)).add(new Vector(0, 0, 2)),
				Vector.zero,
				{ mass: 1 }
			)
		)
	})

	const graphics = [
		new PointGraphic("topping-*", { color: "#f10d97", radius: 5 }, 0),
		new PointGraphic("cake-*", { color: "#f1b868", radius: 5 }, 0),
		new CameraInfo()
	]
	
	return new Universe(donut, actions, graphics)
}

function protonExperiment(): Universe {
	let points = [
		new Point(
			"proton-1",
			new Vector(0, 0, 0),
			Vector.zero,
			{ mass: 1000 }
		),
		new Point(
			"electron-1",
			new Vector(0, 1, 1),
			new Vector(1, -1, 0),
			{ mass: 1 }
		)
	]

	let actions = [
		new Interaction(
			WholeSpace,
			(p1, p2) => {
				let ab = p1.pos.sub(p2.pos)
				return ab.unitary().times(0.01 * p1.mass * p2.mass / ab.norm2())
			}
		),
		new StringConstraint(["proton-1", "electron-1"])
	]

	let graphics = [
		new PointGraphic("proton-.\\d*", { color: "red", radius: 10 }),
		new PointGraphic("electron-\\d*", { color: "blue", radius: 3 }),
		new CameraInfo()
	]

	return new Universe(points, actions, graphics)
}

export function chainExperiment(): Universe {
    let points = [
        new Point(
            "prisonner",
            new Vector(0, 0, 2),
            new Vector(0, 0, 0),
            { mass: 1 }
        ),
        new Point(
            "partner-1",
            new Vector(2, 0, 2),
            new Vector(0, 0, 0),
            { mass: 1 }
        ),
        new Point(
            "partner-2",
            new Vector(3, 0, 2),
            new Vector(0, 0, 0),
            { mass: 1 }
        ),
    ]

    let actions = [
        new Force(
            WholeSpace,
            (p) => new Vector(0, -9.81*p.mass, 0)
        ),
        new RectContact(
			new Vector(1, -2, 1),
			new Vector(-2, 0, 0),
			new Vector(0, 0, 2),
			0.5,
            { restitution: 1, friction: 0 }
        ),
        new StringConstraint(["prisonner", "partner-1", "partner-2"])
    ]

    let graphics = [
        new PointGraphic("(prisonner|partner-\d*)"),
		new CameraInfo()
    ]

    return new Universe(points, actions, graphics)
}

export function thePrism(): Universe {
	let a = 1/Math.sqrt(2)

    let points = [
        new Point(
            "point-1",
            new Vector(0, 0, 2),
            new Vector(10, 0, 0),
            { mass: 1 }
        ),
        new Point(
            "point-2",
            new Vector(a, a, 2),
            new Vector(0, 0, 0),
            { mass: 1 }
        ),
        new Point(
            "point-3",
            new Vector(0, a, 2+a),
            new Vector(0, 0, 0),
            { mass: 1 }
        ),
        new Point(
            "point-4",
            new Vector(0, a, 2-a),
            new Vector(0, 5, 0),
            { mass: 1 }
        ),
        new Point(
            "point-5",
            new Vector(-a, a, 2),
            new Vector(0, 15, 0),
            { mass: 1 }
        ),
        new Point(
            "point-6",
            new Vector(0, 2*a, 2),
            new Vector(10, 0, 0),
            { mass: 1 }
        ),
    ]

    let actions = [
        new Force(
            WholeSpace,
            (p) => new Vector(0, -9.81*p.mass, 0)
        ),
		new Force(
			WholeSpace,
			p => p.speed.times(-0.7)
		),
        new RectContact(
			new Vector(100, -100, -100),
			new Vector(-200, 200, 0),
			new Vector(0, 0, 200),
			0.5,
            { restitution: 1, friction: 0 }
        ),
        new StringConstraint(range(6).map(i => `point-${i+1}`), true)
    ]

    let graphics = [
        new PointGraphic("point-\d*"),
		new CameraInfo()
    ]

	return new Universe(points, actions, graphics)
}


export function overloadTest(): Universe {
	let n = 200

	let points = range(n).map(i => new Point(
		`point-${i+1}`,
		new Vector(0, i, 2),
		Vector.zero,
		{ mass: 1 }
	))

	let actions = [
		new Force(
			WholeSpace,
			p => new Vector(0, -9.81*p.mass, 0)
		),
		new Force(
			WholeSpace,
			p => p.speed.times(-0.5)
		),
		new Force(
			{ 
				includes(p: Point) { 
					let n = parseInt(p.id.substring(6, p.id.length))
					return n <= 160 && n % 20 === 0
				}
			},
			_p => new Vector(20, 0, 0)
		),
		new StringConstraint(range(n).map(i => `point-${i+1}`))
	]

	let graphics = [
		new PointGraphic("point-\d*"),
		new CameraInfo()
	]

	return new Universe(points, actions, graphics)
}
