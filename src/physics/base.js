class Vector {
    static fromDirection(direction, norm) {
        return direction.scalarMul(norm / direction.norm());
    }
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    norm() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }
    unitary() {
        return this.scalarMul(1 / this.norm());
    }
    add(other) {
        return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    sub(other) {
        return this.add(other.unaryMinus());
    }
    unaryMinus() {
        return this.scalarMul(-1);
    }
    scalarMul(scalar) {
        return new Vector(scalar * this.x, scalar * this.y, scalar * this.z);
    }
    scalarProd(other) {
        return (this.x * other.x
            + this.y * other.y
            + this.z * other.z);
    }
    vectorProd(other) {
        return new Vector(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
    }
    projectOnto(u, v) {
        let w = u.vectorProd(v).unitary();
        return this.sub(w.scalarMul(this.scalarProd(w)));
    }
    angle(other) {
        if (other === Vector.zero || this === Vector.zero)
            return 0;
        return Math.acos(this.scalarProd(other) / (this.norm() * other.norm()));
    }
    toString() {
        return "(" + this.x + "," + this.y + "," + this.z + ")";
    }
}
Vector.zero = new Vector(0, 0, 0);
export { Vector };
export function vectorialSum(vectors) {
    return vectors.reduce((v1, v2) => v1.add(v2), Vector.zero);
}
//# sourceMappingURL=base.js.map