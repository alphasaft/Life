import { sealed } from "../util/classes";
import { Point, PointID } from "./point";
import { Vector } from "./vector";


export type ActionType = InstanceType<typeof ActionType>
export let ActionType = sealed(class ActionType {
    priority: number

    constructor(priority: number) { this.priority = priority }

    static StandardAction = new ActionType(0)
    static ContactAction = new ActionType(1)
    static ConstraintAction = new ActionType(2)
    static CorrectiveAction = new ActionType(3)
})

export interface ActionTarget {
    includes(point: Point): boolean
}

export let WholeSpace: ActionTarget = {
    includes(_point: Point): boolean {
        return true
    }
}

export class Only implements ActionTarget {
    private pointIds: PointID[]

    constructor(ids: PointID[]) {
        this.pointIds = ids
    }

    includes(point: Point): boolean {
        return this.pointIds.includes(point.id)
    }
}

export class Excluding implements ActionTarget {
    private excluded: Point[]

    constructor(excluded: Point[]) {
        this.excluded = excluded
    }

    includes(point: Point): boolean {
        return !this.excluded.includes(point)
    }
}

export class CuboidArea implements ActionTarget {
    private p1: Vector
    private p2: Vector

    constructor(p1: Vector, p2: Vector) {
        this.p1 = p1
        this.p2 = p2
    }

    private between(a: number, b: number, x: number): boolean {
        return a <= x && x <= b
    }

    includes(point: Point): boolean {
        let pos = point.pos
        let p1 = this.p1
        let p2 = this.p2
        let between = this.between

        return between(p1.x, p2.x, pos.x) && between(p1.y, p2.y, pos.y) && between(p1.z, p2.z, pos.z)
    }
}


export interface Action {
    type: ActionType

    execute(points: Point[], timelapse: number): void
}
