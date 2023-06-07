import { Vector } from "./base";
export class Force {
    static constant(v) {
        return new Force(_ => v);
    }
    constructor(expression) {
        this.expression = expression;
    }
}
export class Action {
    constructor(expression) {
        this.expression = expression;
    }
    from(point1) {
        return new Force(point2 => point1 === point2 ? Vector.zero : this.expression(point1, point2));
    }
}
//# sourceMappingURL=force.js.map