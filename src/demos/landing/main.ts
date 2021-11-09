import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

//@ts-ignore
//import spaceUrl from "@app/assets/space2.jpeg"
const spaceUrl = "https://storage.googleapis.com/trainquility-project.appspot.com/assets/space2.jpeg"
//@ts-ignore
//import moonUrl from "@app/assets/moon.jpeg"
const moonUrl = "https://storage.googleapis.com/trainquility-project.appspot.com/assets/moon.jpeg"
//@ts-ignore
//import normalUrl from "@app/assets/normal.jpeg"
const normalUrl = "https://storage.googleapis.com/trainquility-project.appspot.com/assets/normal.jpeg"

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls

let anim = 0

// let torus: THREE.Mesh
let moon: THREE.Mesh

export const stop = () => {
    if (anim)
        cancelAnimationFrame(anim)
}

export const setup = (canvas: HTMLCanvasElement) => {

    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    renderer = new THREE.WebGLRenderer({canvas})
    renderer.setPixelRatio(window.devicePixelRatio)
    //renderer.setSize(window.innerWidth, window.innerHeight)
    camera.position.setZ(50)

    renderer.render(scene, camera)

    // const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
    // // const material = new THREE.MeshBasicMaterial({ color: 0xFF3567, wireframe: true })
    // const material = new THREE.MeshStandardMaterial({ color: 0xFF3567 })
    // torus = new THREE.Mesh(geometry, material)
    // scene.add(torus)

    const pointLight = new THREE.PointLight(0xFFFFFF)
    pointLight.position.set(20, 20, 20)
    scene.add(pointLight)

    const ambientLight = new THREE.AmbientLight(0xFFFFFF)
    scene.add(ambientLight)

    // const gridHelper = new THREE.GridHelper(200, 50)
    // scene.add(gridHelper)

    controls = new OrbitControls(camera, canvas)

    addSpaceObjects()

    animate()
}

function addSpaceObjects() {
    const spaceTexture = new THREE.TextureLoader().load(spaceUrl)
    scene.background = spaceTexture

    const moonTexture = new THREE.TextureLoader().load(moonUrl)
    const normalTexture = new THREE.TextureLoader().load(normalUrl)
    moon = new THREE.Mesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0xFFFF00,
            map: moonTexture,
            normalMap: normalTexture
        })
    )
    scene.add(moon)
    moon.position.z = -15
    // moon.position.x = -15


    Array(300).fill(0).forEach(addStar)
}

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24)
    const material = new THREE.MeshStandardMaterial({color: 0xFFFFFF})
    const star = new THREE.Mesh(geometry, material)

    const [x, y, z] = Array(3).fill(0).map(a => THREE.MathUtils.randFloatSpread(100))
    star.position.set(x, y, z)
    scene.add(star)
}

function animate() {

    // torus.rotation.x += 0.01
    moon.rotation.y += 0.005
    // torus.rotation.z += 0.01

    controls.update()

    renderer.render(scene, camera)
    anim = requestAnimationFrame(animate)
}

document.onscroll = onScroll
function onScroll() {
    const t = document.body.getBoundingClientRect().top
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;

    camera.position.z = t * -0.01;
    camera.position.x = t * 0.0002;
    camera.rotation.y = t * 0.0002;
}