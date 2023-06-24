import { range } from "./functions"

type Matrix = number[][]

function dims(m: Matrix): [number, number] {
    return [m.length, m[0].length]
}

export function zeros(n: number, p: number): Matrix {
    return range(n).map(i => range(p).map(j => 0))
}


function copy(m: Matrix): Matrix {
    return m.map(r => r.slice())
}

function dilatation(m: Matrix, i: number, lambda: number) {
    for (let k = 0 ; k < m.length ; k++) {
        m[i][k] = lambda*m[i][k]
    }
}

function swap(m: Matrix, i: number, j: number) {
    for (let k = 0 ; k < m.length ; k++) {
        let temp = m[i][k]
        m[i][k] = m[j][k]
        m[j][k] = temp
    }
}

function transvection(m: Matrix, i: number, j: number, lambda: number) {
    for (let k = 0 ; k < m.length ; k++) {
        m[i][k] = m[i][k] + lambda*m[j][k]
    }
}

function idMatrix(n: number): Matrix {
    return range(n).map(i => range(n).map(j => i === j ? 1 : 0))
}


export function invert(m: Matrix): Matrix {
    let [n, p] = dims(m)
    if (n !== p) throw Error("Can't invert non-square matrix.")

    let toInvert = copy(m)
    let result = idMatrix(n)

    for (let j = 0 ; j < p; j++) {
        let iPivot = j
        while (toInvert[iPivot][j] == 0 && iPivot < n) iPivot++
        swap(toInvert, j, iPivot)
        swap(result, j, iPivot)

        for (let i = j+1 ; i < n ; i++) {
            let coeff = toInvert[i][j]/toInvert[j][j]
            transvection(toInvert, i, j, -coeff)
            transvection(result, i, j, -coeff)
        }
    }

    for (let j = p-1 ; j >= 0; j--) {
        let iPivot = j
        while (toInvert[iPivot][j] == 0 && iPivot >= 0) iPivot--
        swap(toInvert, j, iPivot)
        swap(result, j, iPivot)

        for (let i = j - 1 ; i >= 0 ; i--) {
            let coeff = toInvert[i][j]/toInvert[j][j]
            transvection(toInvert, i, j, -coeff)
            transvection(result, i, j, -coeff)
        }
    }

    for (let i = 0 ; i < p ; i++) {
        dilatation(result, i, 1/toInvert[i][i])
        dilatation(toInvert, i, 1/toInvert[i][i])
    }

    return result
}

export function matMul(m1: Matrix, m2: Matrix): Matrix {
    let [n, p1] = dims(m1)
    let [p2, l] = dims(m2)
    if (p1 !== p2) throw Error("Ill-sized matrix.")

    let result = zeros(n, l)
    for (let i = 0 ; i < n ; i++) {
        for (let j = 0 ; j < l ; j++) {
            let cij = 0
            for (let k = 0 ; k < p1 ; k++) {
                cij += m1[i][k]*m2[k][j]
            }
            result[i][j] = cij
        }
    }

    return result
}