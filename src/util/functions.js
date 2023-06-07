export function sumBy(iterable, mapper) {
    return iterable.map(mapper).reduce((a, b) => a + b);
}
export function fillWithDefault(given, default_) {
    return Object.assign(Object.assign({}, default_), given);
}
export function range(n) {
    return Array(n).keys();
}
//# sourceMappingURL=functions.js.map