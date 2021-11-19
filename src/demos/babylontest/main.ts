let anim = 0

export const stop = () => {
    if (anim)
        cancelAnimationFrame(anim)
}

export const resize = (width: number, height: number) => {
     
}

let popup: HTMLDivElement
export const setup = (canv: HTMLCanvasElement, width: number, height: number, pop: HTMLDivElement) => {