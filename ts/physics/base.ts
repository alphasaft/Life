
export class Vector {
	readonly x: number
	readonly y: number
	readonly z: number

	static zero = new Vector(0,0,0)

	static fromDirection(direction: Vector, norm: number): Vector {
		return direction.scalarMul(norm/direction.norm())
	}

	constructor(x: number, y: number, z: number) {
		this.x = x
		this.y = y
		this.z = z
	}
	
	norm(): number {
		return Math.sqrt(this.x**2 + this.y ** 2 + this.z ** 2)
	}

	unitary(): Vector {
		return this.scalarMul(1/this.norm())
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
		return this.scalarMul(-1)
	}

	scalarMul(scalar: number): Vector {
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

    projectOnto(u: Vector, v: Vector) {
		let w = u.vectorProd(v).unitary()
        return this.sub(w.scalarMul(this.scalarProd(w)))
    }

	angle(other: Vector): number {
		if (other === Vector.zero || this === Vector.zero) return 0
		return Math.acos(this.scalarProd(other)/(this.norm()*other.norm()))
	}

	toString() {
		return "(" + this.x + "," + this.y + "," + this.z + ")"
	}
}

export function vectorialSum(vectors: Vector[]): Vector {
	return vectors.reduce((v1,v2) => v1.add(v2), Vector.zero)
}
