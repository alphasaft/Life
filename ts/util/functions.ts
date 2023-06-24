
export function sumBy<T>(iterable: T[], mapper: (arg: T) => number) {
    return iterable.map(mapper).reduce((a,b) => a+b)
}

export function fillWithDefault<T>(given: Partial<T>, default_: T): T {
    return { ...default_, ...given }
}

export function range(end: number): number[]
export function range(start: number, stop: number): number[]
export function range(a: number, b: number | undefined = undefined): number[] {
    return (b === undefined) ? Array.from(Array(a).keys()) : Array.from(Array(b-a).keys()).map(i => i+a)
}

export function roundAt(x: number, afterComa: number): string {
    let before = Math.max(0, Math.floor(Math.log10(Math.abs(x))))+1
    let asString = x.toString()
    return asString.substring(0, before + (asString.includes(".") ? 1 : 0) + (asString.includes("-") ? 1 : 0) + afterComa)
}

export function measureTime<Function extends (...args: any[]) => any>(f: Function): Function {
    return function(...args: any[]) {
        let begin = (new Date()).getTime()
        let result = f(...args)
        let end = (new Date()).getTime()
        console.log(`Function ${f.name} took ${end - begin} ms to execute.`)
        return result
    } as Function
}

export function reorganizeBy<A,B>(items: A[], keys: B[], mapper: (x: A) => B): A[] {
    return keys.map(k => {
        let item = items.find(x => mapper(x) === k) 
        if (item === undefined) throw Error("reorganizeBy failure due to unrecognized key.")
        return item
    })
}

export function shuffled<A>(l: A[]): A[] {
    let lst = l.slice()
    return lst.sort((_a, _b) => Math.random() - 0.5)
}
