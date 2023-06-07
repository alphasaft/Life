import { Vector } from "./base";
import { PhysicalObject, Point } from "./objects";


export type ForceExpression = (appliedTo: Point) => Vector

export class Force {
    expression: ForceExpression

    static constant(v: Vector): Force {
        return new Force(_ => v)
    }

    constructor(expression: ForceExpression) {
        this.expression = expression
    }
}

export type ActionExpression = (from: Point, onto: Point) => Vector

export class Action {
    expression: ActionExpression

    constructor(expression: ActionExpression) {
        this.expression = expression
    }

    from(point1: Point) {
        return new Force(point2 => point1 === point2 ? Vector.zero : this.expression(point1, point2))
    }
}
