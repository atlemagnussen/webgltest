// import * as BABYLON from "babylonjs" 

import { ArcRotateCamera, Color3, Color4, Engine, FreeCamera, HemisphericLight, Mesh, Scene, SceneLoader, StandardMaterial, Vector3 } from "@babylonjs/core"
import { GridMaterial } from "@babylonjs/materials"
// import "@babylonjs/core/Debug/debugLayer"
// import "@babylonjs/inspector"

let ownerEl: HTMLElement
let canvas: HTMLCanvasElement
let engine: Engine


export const stop = () => {
    engine.stopRenderLoop()
}

export const resize = (width: number, height: number) => {
    // canvas.height = width
    // canvas.width = height
    engine.resize()
}

let popup: HTMLDivElement
export const setup = async (owner: HTMLElement, canv: HTMLCanvasElement, width: number, height: number, pop: HTMLDivElement) => {
    ownerEl = owner
    canvas = canv
    engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    scene.clearColor = new Color4(0, 0, 0, 1)


    const myMaterial = new StandardMaterial("std", scene)
    myMaterial.diffuseColor = new Color3(0.5, 0.2, 0.2);
    myMaterial.specularColor = new Color3(0.5, 0.6, 0.87);
    myMaterial.ambientColor = new Color3(0.23, 0.98, 0.53);
    const result = await SceneLoader.ImportMeshAsync("", "/3d/", "digilean-svg-selected.babylon", scene, (e) => {
        console.log(e)
    })
    console.log(result)
    const mesh = result.meshes[0]
    mesh.material = myMaterial
    mesh.scaling = new Vector3(0.5, 0.5, 0.5)
    // const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene)
    // camera.attachControl(canvas, true)
    // const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene)
    // var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    // camera.setTarget(Vector3.Zero())
    // camera.attachControl(canvas, true)

    const camera = new ArcRotateCamera("Camera", 1, 1, 4, Vector3.Zero(), scene)
    camera.attachControl(canvas, false)

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene)
    light.intensity = 0.7
    
    const material = new GridMaterial("grid", scene)
    // const sphere = Mesh.CreateSphere("sphere1", 16, 2, scene)
    // sphere.position.y = 2
    // sphere.material = material
    const ground = Mesh.CreateGround("ground1", 6, 6, 2, scene)
    ground.material = material

    engine.runRenderLoop(() => {
        scene.render()
    })
    // scene.debugLayer.show({ enableClose: true, globalRoot: ownerEl })
}
