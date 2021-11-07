import * as three from "three"

let canvas: HTMLCanvasElement
let renderer: three.WebGLRenderer | null
let camera: three.PerspectiveCamera | null
let scene: three.Scene | null
//let cube: three.Mesh<three.BoxGeometry, three.MeshBasicMaterial>
let cubes: three.Mesh<any, three.MeshPhongMaterial>[]
let anim = 0
export const resizeThree = () => {
    if (renderer && canvas)
        renderer.setSize(canvas.width, canvas.height)
}
export const shutdown = () => {
    if (anim){
        window.cancelAnimationFrame(anim)
    }
    renderer = null
    camera = null
    scene = null
    cubes = []
}
export const initThree = (can: HTMLCanvasElement) => {
    canvas = can
    renderer = new three.WebGLRenderer({canvas})

    const fov = 75
    const aspect = 2  // the canvas default
    const near = 0.1
    const far = 5
    camera = new three.PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 2

    scene = new three.Scene()
    addLight()

    const boxWidth = 1
    const boxHeight = 1
    const boxDepth = 1
    const geometry = new three.BoxGeometry(boxWidth, boxHeight, boxDepth)

    // const material = new three.MeshBasicMaterial({color: 0x44aa88})
    const material = new three.MeshPhongMaterial({color: 0x44aa88})

    //cube = new three.Mesh(geometry, material)
    cubes = [
        makeInstance(geometry, 0x44aa88,  0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844,  2),
    ]
    // scene.add(cube)

    renderer.render(scene, camera)
    anim = requestAnimationFrame(render)
}

function addLight() {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new three.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    scene?.add(light)
}

function makeInstance(geometry: any, color: three.ColorRepresentation, x: number) {
    const material = new three.MeshPhongMaterial({color})
   
    const cube = new three.Mesh(geometry, material)
    scene?.add(cube)
   
    cube.position.x = x
   
    return cube
}

function render(time: number) {
    time *= 0.001;  // convert time to seconds
 
    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    })
   
    renderer?.render(scene!, camera!)
   
    anim = requestAnimationFrame(render)
}
