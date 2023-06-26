import { Action, ActionType, WholeSpace } from "./actions"
import { Point } from "./point"
import { Vector } from "./vector"


type ContactCoeffs = { restitution: number, friction: number }


export class SurfaceContact implements Action {
    type: ActionType = ActionType.ContactAction

    
    private surfaceDescriptor: (pos: Vector) => boolean
    private normalVector: (pos: Vector) => Vector
    private coeffs: ContactCoeffs

    constructor(
        surfaceDescriptor: (pos: Vector) => boolean,
        normalVector: (pos: Vector) => Vector,
        coeffs: ContactCoeffs
    ) {
       this.surfaceDescriptor = surfaceDescriptor
       this.normalVector = normalVector
       this.coeffs = coeffs
    }

    execute(points: Point[], timelapse: number): void {
        for (let p of points) {
            if (this.surfaceDescriptor(p.pos)) {
                let n = this.normalVector(p.pos)
                if (p.speed.scalarProd(n) < 0) {
                    p.setSpeed(p.speed.orthogonalProjection(n).times(1 - this.coeffs.friction).sub(p.speed.along(n).times(this.coeffs.restitution)))
                }
            }
        }
    }
}

export class RectContact extends SurfaceContact {
    constructor(
        begin: Vector,
        xVector: Vector,
        yVector: Vector,
        thickness: number,
        coeffs: ContactCoeffs,
    ) {
        let uz = xVector.vectorProd(yVector).unitary()

        super(
            pos => {
                let relPos = pos.sub(begin)
                return (
                    relPos.scalarProd(xVector) > 0 
                    && relPos.scalarProd(yVector) > 0
                    && relPos.scalarProd(xVector) < xVector.norm2()
                    && relPos.scalarProd(yVector) < yVector.norm2()
                    && Math.abs(relPos.scalarProd(uz)) < thickness
                )
            },
            pos => {
                let relPos = pos.sub(begin)
                return uz.times(relPos.scalarProd(uz))
            },
            coeffs
        )
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
