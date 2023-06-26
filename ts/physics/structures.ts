import { NUple } from "../util/aliases"
import { range, reorganizeBy, safeDiv, shuffled } from "../util/functions"
import { Matrix, invert, make, matMul, zeros } from "../util/matrix"
import { ActionType, Only, Action } from "./actions"
import { Point, PointID } from "./point"


export class StringConstraint implements Action {
    type: ActionType = ActionType.ConstraintAction

    private ids: PointID[]
    private rigid: boolean
    private counter = 0

    constructor(ids: PointID[], rigid: boolean = false) {
        // TODO : Check that there is no duplicate id 
        this.ids = ids
        this.rigid = rigid
    }

    execute(points: Point[], _timelapse: number): void {
        let chainPoints = points.filter(p => this.ids.includes(p.id))
        chainPoints = this.rigid ? shuffled(chainPoints) : reorganizeBy(chainPoints, this.ids, (p) => p.id) 
        let n = chainPoints.length - 1

        let positions = chainPoints.map(p => p.pos)
        let speeds = chainPoints.map(p => p.speed)
        let masses = chainPoints.map(p => p.mass)

        let bindingsEquationsMatrix = zeros(n, n)
        let links = range(n).map(i => positions[i+1].sub(positions[i]).unitary())
        let speedDeltas = range(n).map(i => [speeds[i+1].sub(speeds[i]).scalarProd(links[i])])
        let scalarProds = range(n-1).map(i => links[i].scalarProd(links[i+1]))

        for (let i = 0; i < n; i++) {
            if (i > 0) bindingsEquationsMatrix[i][i-1] = -scalarProds[i-1]/masses[i]
            bindingsEquationsMatrix[i][i] = 1/masses[i] + 1/masses[i+1]
            if (i < n-1) bindingsEquationsMatrix[i][i+1] = -scalarProds[i]/masses[i+1]
        }
        let bindingsCoeffs = matMul(invert(bindingsEquationsMatrix), speedDeltas).map(row => row[0])
        if (this.counter === 0) console.log(bindingsCoeffs[bindingsCoeffs.length-1], bindingsCoeffs[0])
        
        for (let i = 0; i < chainPoints.length; i++) {
            if (i > 0) chainPoints[i].addSpeed(links[i-1].times(-bindingsCoeffs[i-1]/masses[i]))
            if (i < n) chainPoints[i].addSpeed(links[i].times(bindingsCoeffs[i]/masses[i]))
        }

        this.counter++
    }
}


export class OptimizedExperimentalStringConstraint implements Action {
    type: ActionType = ActionType.ConstraintAction

    private ids: PointID[]

    constructor(ids: PointID[]) {
        this.ids = ids
    }

    execute(points: Point[], _timelapse: number): void {
        let chainPoints = reorganizeBy(points.filter(p => this.ids.includes(p.id)), this.ids, p => p.id)
        switch (chainPoints.length) {
            case 0:
            case 1:
                return
            case 2:
                this.executeForCouple(chainPoints)
                break
            default:
                this.executeFor3OrMore(chainPoints)
        }
    }

    private executeForCouple(points: Point[]): void {
        let [p1, p2] = points
        let m1 = p1.mass
        let m2 = p2.mass
        let u12 = p2.pos.sub(p1.pos).unitary()
        let a = (p2.speed.sub(p1.speed).scalarProd(u12))*(m1*m2)/(m1 + m2)
        p1.addSpeed(u12.times(a/m1))
        p2.addSpeed(u12.times(-a/m2))
    }

    private executeFor3OrMore(points: Point[]): void {

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

        let a = 0
        let b = 0
        for (let i = 0; i < n; i++) {
            let temp = a
            a = -xNextCoeffs[i]/(xPrevCoeffs[i]*a + xCurrCoeffs[i])
            b = (rightMember[i] - xPrevCoeffs[i]*b)/(xPrevCoeffs[i]*temp + xCurrCoeffs[i])
        }

        let result = [0, b]
        for (let i = n-1 ; i > 0 ; i--) {
            result.push((rightMember[i] - (result[result.length-1]*xCurrCoeffs[i] + result[result.length-2]*xNextCoeffs[i]))/xPrevCoeffs[i])
        }
        result.reverse()

        for (let i = 0 ; i < n ; i++) {
            let pLeft = points[i]
            let pRight = points[i+1]
            pLeft.addSpeed(links[i].times(result[i]/pLeft.mass))
            pRight.addSpeed(links[i].times(-result[i]/pRight.mass))
        }
    }
}



