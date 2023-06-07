
export function sumBy<T>(iterable: T[], mapper: (arg: T) => number) {
    return iterable.map(mapper).reduce((a,b) => a+b)
}

export function fillWithDefault<T>(given: Partial<T>, default_: T): T {
    return { ...default_, ...given }
}

export function range(n: number): Iterable<number> {
    return Array(n).keys()
}

export function roundAt(x: number, afterComa: number): string {
    let before = Math.max(0, Math.floor(Math.log10(Math.abs(x))))+1
    let asString = x.toString()
    return asString.substring(0, before + (asString.includes(".") ? 1 : 0) + (asString.includes("-") ? 1 : 0) + afterComa)
}