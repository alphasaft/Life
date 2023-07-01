import { range, reorganizeBy, safeDiv, shuffled } from "../util/functions"
import { invert, matMul, zeros } from "../util/matrix"
import { ActionType, Action } from "./actions"
import { Point, PointID } from "./point"


export class StringConstraint implements Action {
    type: ActionType = ActionType.ConstraintAction

    counter = 0

    private ids: PointID[]

    constructor(ids: PointID[]) {
        this.ids = ids
    }

    execute(points: Point[], _timelapse: number): void {
        points = reorganizeBy(points.filter(p => this.ids.includes(p.id)), this.ids, p => p.id)

        let n = points.length - 1
        let positions = points.map(p => p.pos)
        let speeds = points.map(p => p.speed)
        let masses = points.map(p => p.mass)

        let links = range(n).map(i => positions[i+1].sub(positions[i]).unitary())
        let scalarProds = range(n-1).map(i => links[i].scalarProd(links[i+1]))

        let xPrevCoeffs = [0].concat(range(n-1).map(i => -scalarProds[i]/masses[i+1]))
        let xCurrCoeffs = range(n).map(i => 1/masses[i] + 1/masses[i+1])
        let xNextCoeffs = range(n-1).map(i => -scalarProds[i]/masses[i+1]).concat([0])
        let rightMember = range(n).map(i => speeds[i+1].sub(speeds[i]).scalarProd(links[i]))

        let aArray = [0]
        let bArray = [0]
        let result: number[] = Array(n+1)
        for (let i = 0; i < n; i++) {
            aArray.push(-xNextCoeffs[i]/(xPrevCoeffs[i]*aArray[i] + xCurrCoeffs[i]))
            bArray.push((rightMember[i] - xPrevCoeffs[i]*bArray[i])/(xPrevCoeffs[i]*aArray[i] + xCurrCoeffs[i]))
        }

        result[n] = 0
        result[n-1] = bArray[n]
        for (let j = n-2 ; j >= 0 ; j--) {
            result[j] = aArray[j+1]*result[j+1] + bArray[j+1]
        }

        for (let i = 0 ; i < n ; i++) {
            let pLeft = points[i]
            let pRight = points[i+1]
            pLeft.addSpeed(links[i].times(result[i]/pLeft.mass))
            pRight.addSpeed(links[i].times(-result[i]/pRight.mass))
        }

        this.counter++
    }
}
