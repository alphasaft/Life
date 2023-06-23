import { Vector } from "./physics/vector";
import { Renderer3D } from "./frontend/renderers";
import { Camera } from "./frontend/camera";
import { MainLoop, MainLoopSettings } from "./frontend/loop"; 
import { getKeywatcher } from "./frontend/watchers";
import { Canvas, ProgressBar } from "./util/aliases";
import { Ref } from "./frontend/dynamic";
import { chainExperiment, donutExperiment } from "./experiments";
import { invert, matMul } from "./util/matrix";


declare var document: Document
declare const $: JQueryStatic

var originalLog = console.log;
console.log = (...objs: any[]) => originalLog(...objs.map(obj => JSON.parse(JSON.stringify(obj))))

function getCamera(): Camera {
	return Camera.standard(
		new Vector(0, 0, 0),
		24,
		14
	)

	/* return new Camera(
		new Vector(1, 0, 0),
		new Vector(0, 0, 1),
		new Vector(0, -1, 0),
		new Vector(0, 4, 2),
		24,
		14,
		2.59
	) */
}

function initUI(mainloop: MainLoop) {
	let canvas = mainloop.getCanvas()
	let camera = mainloop.getCamera()
		
	let xPressed = getKeywatcher(canvas, "x")
	let yPressed = getKeywatcher(canvas, "y")
	let zPressed = getKeywatcher(canvas, "z")
	let anchor = new Ref(new Vector(0, 0, 0))

	$("#speed-bar").on("mousemove", function(this: ProgressBar, e) {
		const width = this.clientWidth
		const leftX = this.clientLeft
		let value = (e.offsetX - leftX)/width*this.max
		this.value = value
		$("#speed-percentage").text(Math.round((10**(this.value-1)*100)).toString() + "%")
	})
	
	$("#reset-system").on("click", function(e) {
		mainloop.setSystem(chainExperiment())
	})

	$("#reset-camera").on("click", function (e) {
		mainloop.setCamera(getCamera())
	})

	$("#reset-all").on("click", function (e) {
		$("#reset-system").trigger("click")
		$("#reset-camera").trigger("click")
	}) 

	$(document).on("keydown", function (e) {
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

	$(document).on("keydown", function (e) {
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

	$(document).on("keydown", function (e) {
		let zoom = 0.9 | 1.1
		switch (e.key) {
			case "w":
				zoom = 0.9
				break
			case "c":
				zoom = 1.1
				break
			default:
				return
		}

		camera.zoomIn(zoom)
	})
}


function getMainloop() {
	let canvas = document.getElementById("canvas") as Canvas
	let camera = getCamera()
	let renderer = new Renderer3D(canvas, camera)
	let system = chainExperiment()
	let settings: MainLoopSettings = {
		tickDuration: 0.0001,  
		timeFactor: () => 10**($<ProgressBar>("#speed-bar").get(0)!.value-1),
	}
	return new MainLoop(renderer, system, settings)
}


function main() {
	let mainloop = getMainloop()
	initUI(mainloop)
	mainloop.run()
}


if (typeof document !== "undefined") {
	main()
}
 