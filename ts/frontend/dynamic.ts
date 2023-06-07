
export type Dynamic<T> = (() => T) | T

export function get<T extends object | number | string>(x: Dynamic<T>): T {
    if (typeof x === "function") return x()
    return x
}


export class Ref<T> {
    private value: T

    constructor(initValue: T) {
        this.value = initValue
    }

    get(): T {
        return this.value
    }

    set(newValue: T) {
        this.value = newValue
    }
}

export class Hot<T> {
    private value: T
    private provider: () => T
    private cold: boolean

    constructor(value: T, provider: () => T) {
        this.value = value
        this.provider = provider
        this.cold = false
    }

    setCold() {
        this.cold = true
    }

    get() {
        if (this.cold) {
            this.value = this.provider()
            this.cold = false
        }
        return this.value
    }

}
