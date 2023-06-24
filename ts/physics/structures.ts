import { measureTime, range, reorganizeBy, shuffled } from "../util/functions"
import { invert, matMul, zeros } from "../util/matrix"
import { ActionType, Only, Action } from "./actions"
import { PointID } from "./point"


export class StringConstraint extends Action {

    constructor(ids: PointID[], rigid: boolean = false) {
        super(
            ActionType.ConstraintAction,
            new Only(ids),
            ids.length,
            measureTime(points => {
                if (rigid) {
                    points = shuffled(points)
                } else {
                    points = reorganizeBy(points, ids, p => p.id)
                }

                let n = points.length - 1
                let positions = points.map(p => p.pos)
                let speeds = points.map(p => p.speed)
                let masses = points.map(p => p.mass)

                let bindingsEquationsMatrix = zeros(n, n)
                let links = range(n).map(i => positions[i+1].sub(positions[i]).unitary())
                let speedDeltas = range(n).map(i => [speeds[i+1].sub(speeds[i]).scalarProd(links[i])])
                let scalarProds = [1].concat(range(n-1).map(i => links[i].scalarProd(links[i+1])))

                for (let i = 0; i < n; i++) {
                    if (i > 0) bindingsEquationsMatrix[i][i-1] = -scalarProds[i]/masses[i]
                    bindingsEquationsMatrix[i][i] = 1/masses[i] + 1/masses[i+1]
                    if (i < n-1) bindingsEquationsMatrix[i][i+1] = -scalarProds[i+1]/masses[i+1]
                }

                let bindingsCoeffs = matMul(invert(bindingsEquationsMatrix), speedDeltas).map(row => row[0])
                
                for (let i = 0; i < points.length; i++) {
                    if (i > 0) points[i].addSpeed(links[i-1].times(-bindingsCoeffs[i-1]/masses[i]))
                    if (i < n) points[i].addSpeed(links[i].times(bindingsCoeffs[i]/masses[i]))
                }
            })
        )   
    }
}
