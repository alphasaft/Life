
export function sumBy<T>(iterable: T[], mapper: (arg: T) => number) {
    return iterable.map(mapper).reduce((a,b) => a+b)
}

export function fillWithDefault<T>(given: Partial<T>, default_: T): T {
    return { ...default_, ...given }
}

export function range(n: number): Iterable<number> {
    return Array(n).keys()
}
