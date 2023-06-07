import { Vector } from "./physics/base";
import { Point } from "./physics/objects";
import { PhysicalSystem } from "./physics/system";
import { Renderer3D, Camera, Renderer } from "./frontend/renderers";
import { MainLoop, MainLoopSettings } from "./frontend/loop"; 
import { getKeywatcher } from "./frontend/watchers";
import { Canvas, ProgressBar } from "./util/aliases";


declare var document: Document
declare const $: JQueryStatic


function getSystem(): PhysicalSystem {
	const speed = new Vector(0, 0, 0)

	const particles = [
		new Point(
			new Vector(0, 0, 1),
			speed,
			{ mass: 1 }
		),
		new Point(
			new Vector(0, 0, 2),
			speed,
			{ mass: 1 }
		),
		new Point(
			new Vector(0, 1, 1),
			speed,
			{ mass: 1 }
		),
		new Point(
			new Vector(0, 1, 2),
			speed,
			{ mass: 1 }
		),
		new Point(
			new Vector(1, 0, 1),
			speed,
			{ mass: 1 }
		),
		new Point(
			new Vector(1, 0, 2),
			speed,
			{ mass: 1 }
		),
		new Point(
			new Vector(1, 1, 1),
			speed,
			{ mass: 1 }
		),
		new Point(
			new Vector(1, 1, 2),
			speed,
			{ mass: 1 }
		)
	]
	
	return new PhysicalSystem(particles)
}

function getCamera(): Camera {
	return Camera.standard(24, 14)
}


function getMainloop() {
	let canvas = document.getElementById("canvas") as Canvas
	let camera = Camera.standard(24, 14)
	let renderer = new Renderer3D(canvas, camera)
	let system = getSystem()
	let settings: MainLoopSettings = {
		tickDuration: 0.00001,              
		timeFactor: () => 10**($<ProgressBar>("#speed-bar").get(0).value-1),
	}
	return new MainLoop(renderer, system, settings)
}


function initUI(mainloop: MainLoop) {
	let canvas = mainloop.getCanvas()
	let camera = mainloop.getCamera()
		
	let xPressed = getKeywatcher(canvas, "x")
	let yPressed = getKeywatcher(canvas, "y")
	let zPressed = getKeywatcher(canvas, "z")
	

	$("#speed-bar").on("mousemove", function(this: ProgressBar, e) {
		const width = this.clientWidth
		const leftX = this.offsetLeft
		let value = (e.screenX - leftX)/width*this.max
		this.value = value
		$("#speed-percentage").text(Math.round((10**(this.value-1)*100)).toString() + "%")
	})
	
	$("#reset-system").on("click", function(e) {
		mainloop.setSystem(getSystem())
	})

	$("#reset-camera").on("click", function (e) {
		mainloop.setCamera(getCamera())
	})

	$("#reset-all").on("click", function (e) {
		$("#reset-system").trigger("click")
		$("#reset-camera").trigger("click")
	}) 

	$(canvas).on("keydown", function (e) {
		let direction: 1 | -1
		switch (e.key) {
			case "ArrowUp":
				direction = 1
				break
			case "ArrowDown":
				direction = -1
				break
			default:
				return
		}

		let angle = 3*Math.PI/180*direction
		if (xPressed.get()) {
			camera.rotateAroundX(angle)
		} else if (yPressed.get()) {
			camera.rotateAroundY(angle)
		} else if (zPressed.get()) {
			camera.rotateAroundZ(angle)
		}
	})

	$(canvas).on("keydown", function (e) {
		let direction: 1 | -1
		switch (e.key) {
			case "ArrowLeft":
				direction = 1
				break
			case "ArrowRight":
				direction = -1
				break
			default:
				return
		}

		let movement = direction*0.05
		if (xPressed.get()) {
			camera.moveAlongX(movement)
		} else if (yPressed.get()) {
			camera.moveAlongY(movement)
		} else if (zPressed.get()) {
			camera.moveAlongZ(movement)
		}
	})

	$(canvas).on("focus", function (e)  {
		$(this).css("border", "3px solid black")
	}).on("blur", function (e) {
		$(this).css("border", "1px solid black")
	})
}


function main() {
	let mainloop = getMainloop()
	initUI(mainloop)
	mainloop.run()
}


if (typeof document !== "undefined") {
	main()
}
