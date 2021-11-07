import * as THREE from "three"
import { renderSVG } from "./svg"
import { setupScene, stopScene } from "./scene"
const extrusion = 1
const scale = 0.005
//@ts-ignore
import svgUrl from "@app/assets/digilean.svg"

let update = (extrusion: number) => {}
let updateScale = (scale: number) => {}

let scene: THREE.Scene
let group: THREE.Group

export const setup = async (canvas: HTMLCanvasElement) => {
    scene = setupScene(canvas)

    const render = await renderSVG(svgUrl, extrusion, scale)
    // 
    update = render.update
    updateScale = render.updateScale
    group = render.svgGroup
    scene.add(group)
}

export const stop = () => {
    stopScene()
}

export const changExtrusion = (ext: number) => {
    update(ext)
}
export const changeScale = (scale: number) => {
    //scene.remove(group)
    const z = group.scale.z
    group.scale.set(scale, scale, z)
    // group.scale.x = scale
    // group.scale.y = scale
    // scene.add(group)
    // updateScale(scale)
}
// ...



