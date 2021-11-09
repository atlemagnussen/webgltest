import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

//@ts-ignore
//import spaceUrl from "@app/assets/space2.jpeg"
const spaceUrl = "https://storage.googleapis.com/trainquility-project.appspot.com/assets/space2.jpeg"
//@ts-ignore
//import moonUrl from "@app/assets/moon.jpeg"
const moonUrl = "https://storage.googleapis.com/trainquility-project.appspot.com/assets/moon.jpeg"
const normalUrl = "https://storage.googleapis.com/trainquility-project.appspot.com/assets/normal.jpeg"

//@ts-ignore
import globeUrl from "@app/assets/globe4.jpg"

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls

let anim = 0

// let torus: THREE.Mesh
let moon: THREE.Mesh
let earth: THREE.Mesh
let earthMaterial: THREE.MeshStandardMaterial

export const stop = () => {
    if (anim)
        cancelAnimationFrame(anim)
}

export const setup = (canvas: HTMLCanvasElement) => {

    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    renderer = new THREE.WebGLRenderer({
        canvas, 
        antialias: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    //renderer.setSize(window.innerWidth, window.innerHeight)
    camera.position.z = 10

    renderer.render(scene, camera)

    const pointLight = new THREE.PointLight(0xFFFFFF)
    pointLight.position.set(20, 20, 20)
    scene.add(pointLight)

    const ambientLight = new THREE.AmbientLight(0xFFFFFF)
    scene.add(ambientLight)

    // const gridHelper = new THREE.GridHelper(200, 50)
    // scene.add(gridHelper)

    controls = new OrbitControls(camera, canvas)
    // addSpaceBackground()
    addEarth()
    addMoon()
    animate()
}

function addSpaceBackground() {
    const spaceTexture = new THREE.TextureLoader().load(spaceUrl)
    scene.background = spaceTexture
}
function addEarth() {
    const earthTexture = new THREE.TextureLoader().load(globeUrl)
    earthMaterial = new THREE.MeshStandardMaterial({
        map: earthTexture
    })
    earth = new THREE.Mesh(
        new THREE.SphereGeometry(5, 50, 50),
        earthMaterial
    )
    scene.add(earth)
    earth.rotation.x = 0.7
}
function addMoon() {
    const moonTexture = new THREE.TextureLoader().load(moonUrl)
    const normalTexture = new THREE.TextureLoader().load(normalUrl)
    moon = new THREE.Mesh(
        new THREE.SphereGeometry(2, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0xFFFF00,
            map: moonTexture,
            normalMap: normalTexture
        })
    )
    scene.add(moon)
    moon.position.y = 5
    moon.position.x = 50
    moon.position.z = -60
}

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24)
    const material = new THREE.MeshStandardMaterial({color: 0xFFFFFF})
    const star = new THREE.Mesh(geometry, material)

    const [x, y, z] = Array(3).fill(0).map(a => THREE.MathUtils.randFloatSpread(100))
    star.position.set(x, y, z)
    scene.add(star)
}

// const lights = [0x111111, 0x222222, 0x333333, 0x444444, 0x555555, 0x666666, 0x777777, 0x888888, 0x999999, 0xAAAAAA, 0xBBBBBB, 0xCCCCCC, 0xDDDDDD, 0xEEEEEE, 0xFFFFFF]
// let color = 0
function animate() {

    // if (color == 255) color = 0
    // else color += 1
    // earthMaterial.color = new THREE.Color(`rgb(${color}, ${color}, ${color})`)
    
    earth.rotation.y += 0.005
    
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