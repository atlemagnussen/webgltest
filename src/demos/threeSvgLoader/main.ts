import * as THREE from "three"
import { renderSVG } from "./svg"
import { setupScene, stopScene } from "./scene"
const extrusion = 1
const scale = 0.005
//@ts-ignore
import svgUrl from "@app/assets/digilean.svg"
let update = (extrusion: number) => {}

let scene: THREE.Scene
export const setup = async (canvas: HTMLCanvasElement) => {
    scene = setupScene(canvas)

    const render = await renderSVG(svgUrl, extrusion, scale)
    // 
    update = render.update
    scene.add(render.object)
}

export const stop = () => {
    stopScene()
}

export const changExtrusion = (ext: number) => {
    update(ext)
}
export const changeScale = (scale: number) => {

}
// ...



