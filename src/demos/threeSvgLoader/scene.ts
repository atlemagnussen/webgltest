import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera

let anim = 0

const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}


export const setupScene = (canvas: HTMLCanvasElement) => {
    scene = new THREE.Scene()
  
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.11,
        1e7
    )
    const ambientLight = new THREE.AmbientLight("#888888")
    const pointLight = new THREE.PointLight("#acd3ef", 2, 800)
    const controls = new OrbitControls(camera, renderer.domElement)
    const animate = () => {
        renderer.render(scene, camera)
        controls.update()
        anim = requestAnimationFrame(animate)
    }

    renderer.setSize(window.innerWidth, window.innerHeight)
    scene.add(ambientLight, pointLight)
    camera.position.z = 50
    camera.position.x = 50
    camera.position.y = 50
    controls.enablePan = true
  
    window.addEventListener("resize", resize)
    animate()

    return scene;
}

export const stopScene = () => {
    window.removeEventListener("resize", resize)
    if (anim)
        window.cancelAnimationFrame(anim)
}