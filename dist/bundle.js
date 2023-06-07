/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Vector; });
/* harmony export (immutable) */ __webpack_exports__["b"] = vectorialSum;
class Vector {
    static fromDirection(direction, norm) {
        return direction.scalarMul(norm / direction.norm());
    }
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    norm() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }
    unitary() {
        return this.scalarMul(1 / this.norm());
    }
    add(other) {
        return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    sub(other) {
        return this.add(other.unaryMinus());
    }
    unaryMinus() {
        return this.scalarMul(-1);
    }
    scalarMul(scalar) {
        return new Vector(scalar * this.x, scalar * this.y, scalar * this.z);
    }
    scalarProd(other) {
        return (this.x * other.x
            + this.y * other.y
            + this.z * other.z);
    }
    vectorProd(other) {
        return new Vector(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
    }
    projectOnto(u, v) {
        let w = u.vectorProd(v).unitary();
        return this.sub(w.scalarMul(this.scalarProd(w)));
    }
    angle(other) {
        if (other === Vector.zero || this === Vector.zero)
            return 0;
        return Math.acos(this.scalarProd(other) / (this.norm() * other.norm()));
    }
    toString() {
        return "(" + this.x + "," + this.y + "," + this.z + ")";
    }
}
Vector.zero = new Vector(0, 0, 0);

function vectorialSum(vectors) {
    return vectors.reduce((v1, v2) => v1.add(v2), Vector.zero);
}
//# sourceMappingURL=base.js.map

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = sumBy;
/* harmony export (immutable) */ __webpack_exports__["a"] = fillWithDefault;
/* unused harmony export range */
function sumBy(iterable, mapper) {
    return iterable.map(mapper).reduce((a, b) => a + b);
}
function fillWithDefault(given, default_) {
    return Object.assign(Object.assign({}, default_), given);
}
function range(n) {
    return Array(n).keys();
}
//# sourceMappingURL=functions.js.map

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = get;
function get(x) {
    if (typeof x === "function")
        return x();
    return x;
}
class Ref {
    constructor(initValue) {
        this.value = initValue;
    }
    get() {
        return this.value;
    }
    set(newValue) {
        this.value = newValue;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Ref;

class Hot {
    constructor(value, provider) {
        this.value = value;
        this.provider = provider;
        this.cold = false;
    }
    setCold() {
        this.cold = true;
    }
    get() {
        if (this.cold) {
            this.value = this.provider();
            this.cold = false;
        }
        return this.value;
    }
}
/* unused harmony export Hot */

//# sourceMappingURL=dynamic.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__physics_base__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__physics_objects__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__physics_system__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__frontend_renderers__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__frontend_loop__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__frontend_watchers__ = __webpack_require__(11);






function getSystem() {
    const speed = new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](0, 0, 0);
    const particles = [
        new __WEBPACK_IMPORTED_MODULE_1__physics_objects__["a" /* Point */](new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](0, 0, 1), speed, { mass: 1 }),
        new __WEBPACK_IMPORTED_MODULE_1__physics_objects__["a" /* Point */](new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](0, 0, 2), speed, { mass: 1 }),
        new __WEBPACK_IMPORTED_MODULE_1__physics_objects__["a" /* Point */](new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](0, 1, 1), speed, { mass: 1 }),
        new __WEBPACK_IMPORTED_MODULE_1__physics_objects__["a" /* Point */](new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](0, 1, 2), speed, { mass: 1 }),
        new __WEBPACK_IMPORTED_MODULE_1__physics_objects__["a" /* Point */](new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](1, 0, 1), speed, { mass: 1 }),
        new __WEBPACK_IMPORTED_MODULE_1__physics_objects__["a" /* Point */](new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](1, 0, 2), speed, { mass: 1 }),
        new __WEBPACK_IMPORTED_MODULE_1__physics_objects__["a" /* Point */](new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](1, 1, 1), speed, { mass: 1 }),
        new __WEBPACK_IMPORTED_MODULE_1__physics_objects__["a" /* Point */](new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](1, 1, 2), speed, { mass: 1 })
    ];
    return new __WEBPACK_IMPORTED_MODULE_2__physics_system__["a" /* PhysicalSystem */](particles);
}
function getCamera() {
    return __WEBPACK_IMPORTED_MODULE_3__frontend_renderers__["a" /* Camera */].standard(24, 14);
}
function getMainloop() {
    let canvas = document.getElementById("canvas");
    let camera = __WEBPACK_IMPORTED_MODULE_3__frontend_renderers__["a" /* Camera */].standard(24, 14);
    let renderer = new __WEBPACK_IMPORTED_MODULE_3__frontend_renderers__["b" /* Renderer3D */](canvas, camera);
    let system = getSystem();
    let settings = {
        tickDuration: 0.00001,
        timeFactor: () => Math.pow(10, ($("#speed-bar").get(0).value - 1)),
    };
    return new __WEBPACK_IMPORTED_MODULE_4__frontend_loop__["a" /* MainLoop */](renderer, system, settings);
}
function initUI(mainloop) {
    let canvas = mainloop.getCanvas();
    let camera = mainloop.getCamera();
    let xPressed = Object(__WEBPACK_IMPORTED_MODULE_5__frontend_watchers__["a" /* getKeywatcher */])(canvas, "x");
    let yPressed = Object(__WEBPACK_IMPORTED_MODULE_5__frontend_watchers__["a" /* getKeywatcher */])(canvas, "y");
    let zPressed = Object(__WEBPACK_IMPORTED_MODULE_5__frontend_watchers__["a" /* getKeywatcher */])(canvas, "z");
    $("#speed-bar").on("mousemove", function (e) {
        const width = this.clientWidth;
        const leftX = this.offsetLeft;
        let value = (e.screenX - leftX) / width * this.max;
        this.value = value;
        $("#speed-percentage").text(Math.round((Math.pow(10, (this.value - 1)) * 100)).toString() + "%");
    });
    $("#reset-system").on("click", function (e) {
        mainloop.setSystem(getSystem());
    });
    $("#reset-camera").on("click", function (e) {
        mainloop.setCamera(getCamera());
    });
    $("#reset-all").on("click", function (e) {
        $("#reset-system").trigger("click");
        $("#reset-camera").trigger("click");
    });
    $(canvas).on("keydown", function (e) {
        let direction;
        switch (e.key) {
            case "ArrowUp":
                direction = 1;
                break;
            case "ArrowDown":
                direction = -1;
                break;
            default:
                return;
        }
        let angle = 3 * Math.PI / 180 * direction;
        if (xPressed.get()) {
            camera.rotateAroundX(angle);
        }
        else if (yPressed.get()) {
            camera.rotateAroundY(angle);
        }
        else if (zPressed.get()) {
            camera.rotateAroundZ(angle);
        }
    });
    $(canvas).on("keydown", function (e) {
        let direction;
        switch (e.key) {
            case "ArrowLeft":
                direction = 1;
                break;
            case "ArrowRight":
                direction = -1;
                break;
            default:
                return;
        }
        let movement = direction * 0.05;
        if (xPressed.get()) {
            camera.moveAlongX(movement);
        }
        else if (yPressed.get()) {
            camera.moveAlongY(movement);
        }
        else if (zPressed.get()) {
            camera.moveAlongZ(movement);
        }
    });
    $(canvas).on("focus", function (e) {
        $(this).css("border", "3px solid black");
    }).on("blur", function (e) {
        $(this).css("border", "1px solid black");
    });
}
function main() {
    let mainloop = getMainloop();
    initUI(mainloop);
    mainloop.run();
}
if (typeof document !== "undefined") {
    main();
}
//# sourceMappingURL=index.js.map

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_functions__ = __webpack_require__(1);


const defaultProperties = {
    mass: undefined,
    charge: 0,
};
const defaultPointStyle = {
    color: "black",
    radius: 10,
};
class Universe {
    constructor(...globalForces) {
        this.globalForces = globalForces;
    }
    generateForces() { return this.globalForces; }
    update(_globalForce, _timelapse) { }
    drawOn(_space) { }
}
/* unused harmony export Universe */

class Point {
    constructor(pos, speed = new __WEBPACK_IMPORTED_MODULE_0__base__["a" /* Vector */](0, 0, 0), properties, { actions, style } = { actions: [], style: {} }) {
        this.pos = pos;
        this.speed = speed;
        this.properties = Object(__WEBPACK_IMPORTED_MODULE_1__util_functions__["a" /* fillWithDefault */])(properties, defaultProperties);
        this.style = Object(__WEBPACK_IMPORTED_MODULE_1__util_functions__["a" /* fillWithDefault */])(style, defaultPointStyle);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Point;

class RigidLinks {
    constructor(...points) {
        this.points = points;
        this.totalMass = Object(__WEBPACK_IMPORTED_MODULE_1__util_functions__["b" /* sumBy */])(points, (p) => p.properties.mass);
        this.barycenterPos = Object(__WEBPACK_IMPORTED_MODULE_0__base__["b" /* vectorialSum */])(points.map((p) => p.pos.scalarMul(p.mass))).scalarMul(1 / this.totalMass);
        this.barycenterSpeed = Object(__WEBPACK_IMPORTED_MODULE_0__base__["b" /* vectorialSum */])(points.map((p) => p.speed.scalarMul(p.mass))).scalarMul(1 / this.totalMass);
        this.kineticMoment = points.map((p) => p.getMovementQuantity().vectorProd(p.pos.sub(this.barycenterPos))).reduce((a, b) => a.add(b));
        this.inertialMoment = Object(__WEBPACK_IMPORTED_MODULE_1__util_functions__["b" /* sumBy */])(points, p => p.mass * Math.pow((p.pos.sub(this.barycenterPos)).norm(), 2));
    }
    GM(M) {
        return M.pos.sub(this.barycenterPos);
    }
    update(globalForce, timelapse) {
        let forcesOnPoints = this.points.map(p => p.appliedAcceleration(globalForce).scalarMul(p.mass));
        let barycenterAcceleration = Object(__WEBPACK_IMPORTED_MODULE_0__base__["b" /* vectorialSum */])(forcesOnPoints).scalarMul(1 / this.totalMass);
        this.barycenterSpeed = this.barycenterSpeed.add(barycenterAcceleration.scalarMul(timelapse));
        this.barycenterPos = this.barycenterPos.add(this.barycenterSpeed.scalarMul(timelapse));
        let moment = Object(__WEBPACK_IMPORTED_MODULE_0__base__["b" /* vectorialSum */])(forcesOnPoints.map((f, i) => this.GM(this.points[i]).vectorProd(f).scalarMul(this.points[i].mass)));
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
/* unused harmony export RigidLinks */

//# sourceMappingURL=objects.js.map

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__force__ = __webpack_require__(7);


class PhysicalSystem {
    constructor(objects) {
        this.objects = objects;
    }
    update(timelapse) {
        let forces = this.objects.map((o) => o.generateForces()).flat();
        let globalForce = new __WEBPACK_IMPORTED_MODULE_1__force__["a" /* Force */](point => forces.map(f => f.expression(point)).reduce((a, b) => a.add(b), __WEBPACK_IMPORTED_MODULE_0__base__["a" /* Vector */].zero));
        this.objects.forEach(it => it.update(globalForce, timelapse));
    }
    drawOn(space) {
        this.objects.forEach((it) => {
            it.drawOn(space);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PhysicalSystem;

//# sourceMappingURL=system.js.map

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(0);

class Force {
    static constant(v) {
        return new Force(_ => v);
    }
    constructor(expression) {
        this.expression = expression;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Force;

class Action {
    constructor(expression) {
        this.expression = expression;
    }
    from(point1) {
        return new Force(point2 => point1 === point2 ? __WEBPACK_IMPORTED_MODULE_0__base__["a" /* Vector */].zero : this.expression(point1, point2));
    }
}
/* unused harmony export Action */

//# sourceMappingURL=force.js.map

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__physics_base__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_classes__ = __webpack_require__(9);


class Camera {
    static standard(width, height) {
        return new Camera(new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](1, 0, 0), new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](0, 1, 0), new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](0, 0, 1), new __WEBPACK_IMPORTED_MODULE_0__physics_base__["a" /* Vector */](0, 0, 0), width, height);
    }
    constructor(ux, uy, uz, center, width, height) {
        this.ux = ux.unitary();
        this.uy = uy.unitary();
        this.uz = uz.unitary();
        this.center = center;
        this.width = width;
        this.height = height;
    }
    rotate(uName, vName, angle) {
        let u = this[uName];
        let v = this[vName];
        this[uName] = u.scalarMul(Math.cos(angle)).add(v.scalarMul(Math.sin(angle)));
        this[vName] = v.scalarMul(Math.cos(angle)).add(u.scalarMul(-Math.sin(angle)));
    }
    rotateAroundX(angle) {
        this.rotate("uy", "uz", angle);
    }
    rotateAroundY(angle) {
        this.rotate("uz", "ux", angle);
    }
    rotateAroundZ(angle) {
        this.rotate("ux", "uy", angle);
    }
    move(axis, movement) {
        console.log("Camera movement detected");
        this.center = this.center.add(axis.scalarMul(movement));
        console.log(this.center.toString());
    }
    moveAlongX(movement) {
        this.move(this.ux, movement);
    }
    moveAlongY(movement) {
        this.move(this.uy, movement);
    }
    moveAlongZ(movement) {
        this.move(this.uz, movement);
    }
    copyState(camera) {
        this.ux = camera.ux;
        this.uy = camera.uy;
        this.uz = camera.uz;
        this.center = camera.center;
        this.width = camera.width;
        this.height = camera.height;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Camera;

class Renderer2D {
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        this.ctx = canvas.getContext("2d");
        this.delayer = new __WEBPACK_IMPORTED_MODULE_1__util_classes__["a" /* Delayer */]();
    }
    clear() {
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    }
    addPoint(pos, color, radius) {
        this.delayer.delay(() => {
            let relativePos = pos.sub(this.camera.center);
            let x = this.canvas.width / this.camera.width * relativePos.scalarProd(this.camera.ux);
            let y = this.canvas.height / this.camera.height * relativePos.scalarProd(this.camera.uy);
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
            this.ctx.fill();
        }, { priority: 0 });
    }
    render() {
        this.delayer.force();
    }
}
/* unused harmony export Renderer2D */

class Renderer3D {
    constructor(canvas, camera) {
        this.delayer = new __WEBPACK_IMPORTED_MODULE_1__util_classes__["a" /* Delayer */]();
        this.camera = camera;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }
    clear() {
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    }
    project(pos) {
        if (pos === null)
            return null;
        let camera = this.camera;
        let angle = Math.PI / 4;
        let projectionCenter = camera.center.sub(camera.uz.scalarMul(camera.width / Math.tan(angle)));
        let lensRadius = camera.width / Math.sin(angle);
        if (pos.sub(camera.center).scalarProd(camera.uz) < 0)
            return null;
        let v = pos.sub(projectionCenter);
        let ux = camera.ux;
        let uy = camera.uy;
        let uz = camera.uz;
        let theta = v.angle(uy);
        let psi = v.projectOnto(ux, uz).angle(ux);
        let projected = ux.scalarMul(lensRadius * Math.sin(theta) * Math.cos(psi))
            .add(uy.scalarMul(lensRadius * Math.cos(theta)))
            .add(uz.scalarMul(lensRadius * Math.sin(theta) * Math.sin(psi)));
        let x = this.canvas.width / camera.width * projected.scalarProd(ux);
        let y = this.canvas.height / camera.height * projected.scalarProd(uy);
        return projected.scalarProd(uz) > 0 ? [
            this.canvas.width - (x + this.canvas.width / 2),
            this.canvas.height - (y + this.canvas.height / 2),
        ] : null;
    }
    scaleRadius(radius, pos) {
        return radius / (Math.abs(pos.sub(this.camera.center).scalarProd(this.camera.uz)) + 1);
    }
    addPoint(pos, color, radius) {
        this.delayer.delay(() => {
            let projection = this.project(pos);
            if (projection === null)
                return;
            let [x, y] = projection;
            let scaledRadius = this.scaleRadius(radius, pos);
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, scaledRadius, scaledRadius, 0, 0, 2 * Math.PI);
            this.ctx.fill();
        }, { priority: -pos.z });
    }
    render() {
        this.delayer.force();
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Renderer3D;

function withTrailing(space) {
    return class WithTrailingMixin extends space {
        constructor(canvas, camera, trailCoeff) {
            super(canvas, camera);
            this.trailCoeff = trailCoeff;
        }
        clear() {
            let ctx = this.canvas.getContext("2d");
            ctx.fillStyle = "rgb(255,255,255," + (1 - this.trailCoeff).toString() + ")";
            ctx.beginPath();
            ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            ctx.fill();
        }
    };
}
function noClear(space) {
    return class NoClearMixin extends space {
        clear() { }
    };
}
const Renderer2DWithTrailing = withTrailing(Renderer2D);
/* unused harmony export Renderer2DWithTrailing */

const Renderer2DNoClear = noClear(Renderer2D);
/* unused harmony export Renderer2DNoClear */

const Renderer3DWithTrailing = withTrailing(Renderer3D);
/* unused harmony export Renderer3DWithTrailing */

const Renderer3DNoClear = noClear(Renderer3D);
/* unused harmony export Renderer3DNoClear */

//# sourceMappingURL=renderers.js.map

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Delayer {
    constructor() {
        this.delayed = [];
    }
    delay(callback, { priority }) {
        this.delayed.push([priority, callback]);
        let j = this.delayed.length - 1;
        while (j >= 1 && this.delayed[j - 1][0] > this.delayed[j][0]) {
            let temp = this.delayed[j - 1];
            this.delayed[j - 1] = this.delayed[j];
            this.delayed[j] = temp;
            j--;
        }
    }
    force() {
        for (let item of this.delayed) {
            item[1]();
        }
        this.delayed = [];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Delayer;

//# sourceMappingURL=classes.js.map

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_functions__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dynamic__ = __webpack_require__(2);


const defaultMainLoopSettings = {
    tickDuration: 0.000001,
    timeFactor: 1
};
class MainLoop {
    constructor(renderer, system, settings = {}) {
        this.renderer = renderer;
        this.system = system;
        this.settings = Object(__WEBPACK_IMPORTED_MODULE_0__util_functions__["a" /* fillWithDefault */])(settings, defaultMainLoopSettings);
    }
    run() {
        this.lastRendering = (new Date()).getTime();
        this.startClock();
    }
    stop() {
        window.cancelAnimationFrame(this.currentFrameHandle);
    }
    setSystem(system) {
        this.system = system;
    }
    getCanvas() {
        return this.renderer.canvas;
    }
    getCamera() {
        return this.renderer.camera;
    }
    setCamera(camera) {
        this.renderer.camera = camera;
    }
    startClock() {
        this.currentFrameHandle = window.requestAnimationFrame(() => {
            this.update();
            this.startClock();
        });
    }
    update() {
        let now = (new Date()).getTime();
        let elapsedSecs = (now - this.lastRendering) / 1000;
        let ticks = Math.round(elapsedSecs / Math.min(elapsedSecs, this.settings.tickDuration));
        this.lastRendering = now;
        for (let i = 0; i <= ticks; i++) {
            this.system.update(elapsedSecs / ticks * Object(__WEBPACK_IMPORTED_MODULE_1__dynamic__["b" /* get */])(this.settings.timeFactor));
        }
        this.renderer.clear();
        this.system.drawOn(this.renderer);
        this.renderer.render();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MainLoop;

//# sourceMappingURL=loop.js.map

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getKeywatcher;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dynamic__ = __webpack_require__(2);

function getKeywatcher(element, key) {
    let watcher = new __WEBPACK_IMPORTED_MODULE_0__dynamic__["a" /* Ref */](false);
    $(document)
        .on("keydown", function (e) { if (e.key === key)
        watcher.set(true); })
        .on("keyup", function (e) { if (e.key === key)
        watcher.set(false); });
    return watcher;
}
//# sourceMappingURL=watchers.js.map

/***/ })
/******/ ]);