import { renderSVG } from "./svg"
import { setupScene } from "./scene"
const extrusion = 1
//@ts-ignore
import svgUrl from "@app/assets/digilean.svg"
let update = (extrusion: number) => {}

export const setup = async (canvas: HTMLCanvasElement) => {
    const scene = setupScene(canvas)

    const render = await renderSVG(extrusion, svgUrl)
    // 
    update = render.update
    scene.add(render.object)
}

export const changExtrusion = (ext: number) => {
    update(ext)
}

// ...



