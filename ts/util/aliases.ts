export type ProgressBar = HTMLProgressElement
export type Canvas = HTMLCanvasElement


type Decr<N extends number> = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9][N]
export type NUple<N extends number, T> = {
    done: [],
    recur: [T, ...NUple<Decr<N>, T>]
}[N extends 0 ? "done" : "recur"]

export type Pair<T> = [T, T]
