// import * as BABYLON from "babylonjs" 

import { ArcRotateCamera, Color3, Color4, CubeTexture, Engine, FreeCamera, HDRCubeTexture, HemisphericLight, Mesh, PBRMetallicRoughnessMaterial, Scene, SceneLoader, StandardMaterial, Vector3 } from "@babylonjs/core"
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
    // scene.createDefaultEnvironment()
    const hdrTexture = CubeTexture.CreateFromPrefilteredData("/3d/environment.env", scene)
    //const reflectionTexture = new HDRCubeTexture("/3d/texture/Frozen_Waterfall_Env.hdr", scene, 128, false, true, false, true);
    scene.environmentTexture = hdrTexture;
    //scene.environmentTexture = new CubeTexture("/3d/environment.env", scene)

    const myMaterial = new StandardMaterial("std", scene)
    myMaterial.diffuseColor = new Color3(0.5, 0.2, 0.2);
    myMaterial.specularColor = new Color3(0.5, 0.6, 0.87);
    myMaterial.ambientColor = new Color3(0.23, 0.98, 0.53);
    const result = await SceneLoader.ImportMeshAsync("", "/3d/", "digilean-svg-selected.babylon", scene, (e) => {
        //console.log(e)
    })
    //console.log(result)
    const mesh = result.meshes[0]
    const scale = 1.5
    mesh.rotation.x = 1
    mesh.position.y = 0
    mesh.scaling = new Vector3(scale, scale, scale)
    const pbr = new PBRMetallicRoughnessMaterial("pbr", scene)
    pbr.baseColor = new Color3(1.0, 0.766, 0.336);
    pbr.metallic = 1.0
    pbr.roughness = 0.3
    mesh.material = pbr
    // const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene)
    // camera.attachControl(canvas, true)
    // const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene)
    // var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    // camera.setTarget(Vector3.Zero())
    // camera.attachControl(canvas, true)

    const camera = new ArcRotateCamera("Camera", 1, 1, 4, Vector3.Zero(), scene)
    camera.attachControl(canvas, false)

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene)
    light.intensity = 1
    
    const light2 = new HemisphericLight("light2", new Vector3(0, 1, 0.1), scene)
    light2.intensity = 1
    const light3 = new HemisphericLight("light2", new Vector3(0.5, 1, 0.4), scene)
    light3.intensity = 1
    const light4 = new HemisphericLight("light2", new Vector3(0.1, 0, 0), scene)
    light4.intensity = 1
    const material = new GridMaterial("grid", scene)
    // const sphere = Mesh.CreateSphere("sphere1", 16, 2, scene)
    // sphere.position.y = 2
    // sphere.material = material
    // const ground = Mesh.CreateGround("ground1", 6, 6, 2, scene)
    // ground.material = material

    engine.runRenderLoop(() => {
        scene.render()
        mesh.rotation.x += 0.01
        mesh.rotation.y += 0.01
    })
    // scene.debugLayer.show({ enableClose: true, globalRoot: ownerEl })
}
