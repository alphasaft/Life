
export class Vector {
	readonly x: number
	readonly y: number
	readonly z: number

	static zero = new Vector(0, 0, 0)
	static ux = new Vector(1, 0, 0)
	static uy = new Vector(0, 1, 0)
	static uz = new Vector(0, 0, 1)

	static fromDirection(direction: Vector, norm: number): Vector {
		return direction.times(norm/direction.norm())
	}

	constructor(x: number, y: number, z: number) {
		this.x = x
		this.y = y
		this.z = z
	}
	
	norm(): number {
		return Math.sqrt(this.x**2 + this.y ** 2 + this.z ** 2)
	}

	norm2(): number {
		return this.x**2 + this.y ** 2 + this.z ** 2
	}

	orthogonal(): Vector {
		return new Vector(
			this.x + this.y,
			this.y + this.z,
			this.z + this.x,
		).vectorProd(this)
	}

	unitary(): Vector {
		return this.times(1/this.norm())
	}

	add(other: Vector): Vector {
		return new Vector(
			this.x + other.x,
			this.y + other.y,
			this.z + other.z
		)
	}

	sub(other: Vector): Vector {
		return this.add(other.unaryMinus())
	}

	unaryMinus(): Vector {
		return this.times(-1)
	}

	times(scalar: number): Vector {
		return new Vector(
			scalar * this.x,
			scalar * this.y,
			scalar * this.z
		)
	}

	scalarProd(other: Vector): number {
		return (
			this.x * other.x
			+ this.y * other.y
			+ this.z * other.z
		)
	}

	vectorProd(other: Vector): Vector {
		return new Vector(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x,
		)
	}

	along(n: Vector) {
		return n.times(this.scalarProd(n)/n.norm2())
	}

    orthogonalProjection(n: Vector) {
        return this.sub(this.along(n))
    }

	orthogonalSymetry(n: Vector) {
		return this.sub(this.along(n).times(2))
	}

	angle(other: Vector): number {
		if (other === Vector.zero || this === Vector.zero) return 0
		return Math.acos(this.scalarProd(other)/(this.norm()*other.norm()))
	}

	hasOnePositiveCoordinate() {
		return this.x >= 0 || this.y >= 0 || this.z >= 0
	}

	hasAllPositiveCoordinate() {
		return this.x >= 0 && this.y >= 0 && this.z >= 0
	}

	toString() {
		return "(" + this.x + "," + this.y + "," + this.z + ")"
	}
}

export function vectorialSum(vectors: Vector[]): Vector {
	return vectors.reduce((v1,v2) => v1.add(v2), Vector.zero)
}
