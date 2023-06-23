import { ActionType, Only, Action } from "./actions"
import { PointID } from "./point"
import { Vector } from "./vector"


export class StringConstraint extends Action {
    constructor(ids: PointID[]) {
        let n = ids.length

        super(
            ActionType.ConstraintAction,
            new Only(ids),
            ids.length,
            points => {
                let speeds = points.map(p => p.speed)
                let modifiedSpeeds = speeds.slice()
                let positions = points.map(p => p.pos)

                for (let i = 0 ; i < n ; i++) {
                    this
                }
            }
        )   
    }
}
