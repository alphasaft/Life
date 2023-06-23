
export class Delayer {
    private delayed: [number, () => void][] 

    static MIN_PRIORITY: { readonly priority: number } = { priority: -Infinity }
    static MAX_PRIORITY: { readonly priority: number } = { priority: Infinity }

    constructor() {
        this.delayed = []
    }
    
    delay(callback: () => void, {priority}: {priority: number}) {
        this.delayed.push([priority, callback])
        let j = this.delayed.length - 1
        while (j >= 1 && this.delayed[j-1][0] < this.delayed[j][0]) {
            let temp = this.delayed[j-1]
            this.delayed[j-1] = this.delayed[j]
            this.delayed[j] = temp
            j--
        }
    }

    force() {
        for (let item of this.delayed) {
            item[1]()
        }
        this.delayed = []
    }
}


export function sealed<T extends new (...args: any[]) => object>(cls: T): T {
    return class Sealed extends cls {
        constructor(...args: any[]) {
            throw EvalError("Can't instatiate sealed class.")
            super()
        }
    }
}
