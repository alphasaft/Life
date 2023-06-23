
export type RGBTuple = [number, number, number]
export type RGBFormattedColor = string
export type HexColor = string 
export type RegisteredColor = "red" | "yellow" | "blue" | "green" | "white" | "black"


export function isHexColor(color: string): color is HexColor {
    return color.startsWith("#")
}

export function isRGBFormattedColor(color: string): color is RGBFormattedColor {
    return color.startsWith("rgb(")
}

export function isRegisteredColor(color: string): color is RegisteredColor {
    return ["red", "yellow", "blue", "green", "white", "black"].includes(color)
}

export function colorToRGB(color: string): RGBTuple {
    return (
        isHexColor(color) ? hexColorToRgb(color) :
        isRGBFormattedColor(color) ? rgbFormattedColorToRgb(color) :
        isRegisteredColor(color) ? registeredColorToRgb(color) :
        (() => { throw Error() })()
    )
}

export function RGBToColor(color: RGBTuple): string {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
}

function hexColorToRgb(color: string): RGBTuple {
    let r = parseInt(color.slice(1, 3), 16)
    let g = parseInt(color.slice(3, 5), 16)
    let b = parseInt(color.slice(5, 7), 16)
    return [r, g, b]
}

function registeredColorToRgb(color: RegisteredColor): RGBTuple {
    let mapping: Record<RegisteredColor, RGBTuple> = {
        red: [255, 0, 0],
        green: [0, 255, 0],
        blue: [0, 0, 255],
        yellow: [0, 255, 255],
        white: [255, 255, 255],
        black: [0, 0, 0]
    }
    return mapping[color]
}

function rgbFormattedColorToRgb(color: String): RGBTuple {
    throw Error("Not implemented")
}