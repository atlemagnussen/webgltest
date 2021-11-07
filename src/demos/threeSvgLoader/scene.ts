import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export const setupScene = (canvas: HTMLCanvasElement) => {
    const scene = new THREE.Scene()
  
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    const camera = new THREE.PerspectiveCamera(
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
        requestAnimationFrame(animate)
    }

    renderer.setSize(window.innerWidth, window.innerHeight)
    scene.add(ambientLight, pointLight)
    camera.position.z = 50
    camera.position.x = 50
    camera.position.y = 50
    controls.enablePan = true
  
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    })
    animate()

    return scene;
}