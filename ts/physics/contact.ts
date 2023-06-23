import { Action, ActionType, WholeSpace } from "./actions"
import { Vector } from "./vector"


type ContactCoeffs = { restitution: number, friction: number }


export class RectContact extends Action {
    constructor(
        begin: Vector,
        xVector: Vector,
        yVector: Vector,
        thickness: number,
        { restitution: restitutionCoeff, friction: frictionCoeff }: ContactCoeffs,
    ) {
        let uz = xVector.vectorProd(yVector).unitary()
        let end = begin.add(xVector).add(yVector)

        super(
            ActionType.ContactAction,
            WholeSpace,
            1,
            ([p]) => {
                let pos = p.pos
                let posFromBegin = pos.sub(begin)
                let endFromPos = end.sub(pos)
                if (posFromBegin.scalarProd(xVector) < 0 || posFromBegin.scalarProd(yVector) < 0) return
                if (endFromPos.scalarProd(xVector) < 0 || endFromPos.scalarProd(yVector) < 0) return

                let distance = pos.sub(begin).scalarProd(uz)
                if (Math.abs(distance) > thickness) return
                else {
                    if (p.speed.scalarProd(uz) * distance < 0) {
                        let newSpeed = p.speed.orthogonalProjection(uz).times(1 - frictionCoeff).sub(uz.times(restitutionCoeff*p.speed.scalarProd(uz)))
                        p.setSpeed(newSpeed)
                    }
                }
            }
        )
    }
}

export class SurfaceContact extends Action {
    constructor(
        surfaceDescriptor: (pos: Vector) => boolean,
        normalVector: (pos: Vector) => Vector,
        coeffs: ContactCoeffs
    ) {
        super(
            ActionType.ContactAction,
            WholeSpace,
            1,
            ([p]) => {
                if (surfaceDescriptor(p.pos)) {
                    let n = normalVector(p.pos)
                    if (p.speed.scalarProd(n) < 0) {
                        p.setSpeed(p.speed.orthogonalProjection(n).times(1 - coeffs.friction).sub(p.speed.along(n).times(coeffs.restitution)))
                    }
                }
            })
    }
}

export class CylinderContact extends SurfaceContact {
    constructor(
        center: Vector,
        axe: Vector,
        radius: number,
        width: number,
        thickness: number,
        coeffs: ContactCoeffs
    ) {
        super(
            pos => {
                let relPos = pos.sub(center)
                let tangeantDistance = relPos.along(axe).norm()
                let radialDistance = relPos.orthogonalProjection(axe).norm()
                return (tangeantDistance < width && radius - thickness <= radialDistance && radialDistance <= radius + thickness) 
            },
            pos => {
                let orthoPos = pos.sub(center).orthogonalProjection(axe)
                return orthoPos.times(orthoPos.norm() - radius)
            },
            coeffs,
        )
    }
}

export class SphereContact extends SurfaceContact {
    constructor(
        center: Vector,
        radius: number,
        thickness: number,
        coeffs: ContactCoeffs
    ) {
        super(
            pos =>  {
                let relPos = pos.sub(center)
                let distance = relPos.norm()
                return (radius - thickness <= distance && distance <= radius + thickness)
            },
            pos => pos.sub(center).times(pos.sub(center).norm() - radius),
            coeffs
        )
    }
}
