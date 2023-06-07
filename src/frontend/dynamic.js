export function get(x) {
    if (typeof x === "function")
        return x();
    return x;
}
export class Ref {
    constructor(initValue) {
        this.value = initValue;
    }
    get() {
        return this.value;
    }
    set(newValue) {
        this.value = newValue;
    }
}
export class Hot {
    constructor(value, provider) {
        this.value = value;
        this.provider = provider;
        this.cold = false;
    }
    setCold() {
        this.cold = true;
    }
    get() {
        if (this.cold) {
            this.value = this.provider();
            this.cold = false;
        }
        return this.value;
    }
}
//# sourceMappingURL=dynamic.js.map