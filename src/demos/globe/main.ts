import * as THREE from "three"
import { data } from "./testdata"
import { findLoc} from "./countriesLoc"
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import vertexShader from "./shaders/vertex"
import fragmentShader from "./shaders/fragment"

import atmosVertexShader from "./shaders/atmosphereVertex"
import atmosFragmentShader from "./shaders/atmosphereFragment"

//import spaceUrl from "@app/assets/space2.jpeg"
const spaceUrl = "https://storage.googleapis.com/trainquility-project.appspot.com/assets/space2.jpeg"
//@ts-ignore
//import moonUrl from "@app/assets/moon.jpeg"
const moonUrl = "https://storage.googleapis.com/trainquility-project.appspot.com/assets/moon.jpeg"
const normalUrl = "https://storage.googleapis.com/trainquility-project.appspot.com/assets/normal.jpeg"

//@ts-ignore
const globeUrl = "https://storage.googleapis.com/trainquility-project.appspot.com/assets/globe5.jpg"

let canvas: HTMLCanvasElement

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
// let controls: OrbitControls

let anim = 0

const earthRadius = 5
let group: THREE.Group
let moon: THREE.Mesh
let earth: THREE.Mesh
//let earthMaterial: THREE.ShaderMaterial
const raycaster = new THREE.Raycaster()

// me lat: 58.95071797166171 lng: 5.697703979485407
const latme = 58.95071797166171
const lngme = 5.697703979485407

export const stop = () => {
    if (anim)
        cancelAnimationFrame(anim)
}

export const resize = (width: number, height: number) => {
    canvas.height = width
    canvas.width = height
    const aspectRatio = width / height
    camera.aspect = aspectRatio
    camera.updateProjectionMatrix();
    renderer.setSize(width, height)
}

let popup: HTMLDivElement
export const setup = (canv: HTMLCanvasElement, width: number, height: number, pop: HTMLDivElement) => {
    canvas = canv
    popup = pop
    canvas.height = width
    canvas.width = height

    const aspectRatio = width / height
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000)
    renderer = new THREE.WebGLRenderer({
        canvas, 
        antialias: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    camera.position.z = 15

    renderer.render(scene, camera)

    // controls = new OrbitControls(camera, canvas)
    // addSpaceBackground()
    addLightBall()
    //addLight()
    addEarth()
    addSkyscrapers()
    addAtmosphere()
    // addMoon()
    addStars()
    addBezier()
    addPointerEvents()
    animate()
}

let lightBall: THREE.Group
function addLightBall() {
    lightBall = new THREE.Group()
    let ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 28, 28),
        new THREE.MeshPhongMaterial({
            color: 0xFFFF00,
            emissive: 0xFFFFFF
        })
    )
    lightBall.add(ball)
    const light = new THREE.PointLight(0xFFFFFF)
    lightBall.add(light)
    lightBall.position.set(-10, 0, 7)
    scene.add(lightBall)
}

function addBezier() {
    const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-20, 10, -5),
        new THREE.Vector3(-10, 5, 10),
        new THREE.Vector3(10, -5, 10),
        new THREE.Vector3(20, -10, -5)
    )
    
    const points = curve.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({color: 0xff0000 })
    const curveObject = new THREE.Line( geometry, material)
    scene.add(curveObject)
}

function addLight() {
    const pointLight = new THREE.PointLight(0xFFFFFF)
    pointLight.position.set(50, 30, 100)
    scene.add(pointLight)

    // const ambientLight = new THREE.AmbientLight(0xFFFFFF)
    // scene.add(ambientLight)
    // const light = new THREE.PointLight( 0xffffff, 1, 100 )
    // light.position.set( 50, 50, 50 )
    // scene.add(light)
}

const pointer = new THREE.Vector2()
let mouse = {
    startX: 0, startY: 0,
    x: 0, y: 0, 
    dragging: false
}
let passive = { passive: true}
const onPointerDown = (event: PointerEvent) => {
    mouse.dragging = true
    mouse.startX = event.clientX
    mouse.startY = event.clientY
}
const onPointerMove = (event: PointerEvent) => {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    popup.style.top = `${event.clientY}px`
    popup.style.left = `${event.clientX}px`
    if (mouse.dragging) {
        let xDiff = event.clientX - mouse.startX
        let yDiff = event.clientY - mouse.startY
        mouse.startX = event.clientX
        mouse.startY = event.clientY
        let xDiffNorm = (xDiff / window.innerWidth) * 2
        let yDiffNorm = (yDiff / window.innerHeight) * 2
        mouse.x += xDiffNorm
        mouse.y += yDiffNorm
    }
}
const onPointerUp = (event: PointerEvent) => {
    mouse.dragging = false
}
function addPointerEvents() {
    document.addEventListener("pointerdown", onPointerDown, passive)
    document.addEventListener("pointermove", onPointerMove, passive)
    document.addEventListener("pointerup", onPointerUp, passive)
}

function addEarth() {
    const earthTexture = new THREE.TextureLoader().load(globeUrl)
    let earthMaterial = new THREE.MeshStandardMaterial({
        map: earthTexture
    })
    // earthMaterial = new THREE.ShaderMaterial({
    //     vertexShader,
    //     fragmentShader,
    //     uniforms: {
    //         globeTexture: {
    //             value: earthTexture
    //         }
    //     }
    // })
    earth = new THREE.Mesh(
        new THREE.SphereGeometry(earthRadius, 50, 50),
        earthMaterial
    )
    earth.rotation.y = -Math.PI / 2
    group = new THREE.Group()
    group.add(earth)
    scene.add(group)
}

function addAtmosphere() {
    
    let atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: atmosVertexShader,
        fragmentShader: atmosFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    })
    let atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(5, 50, 50),
        atmosphereMaterial
    )
    atmosphere.scale.set(1.1, 1.1, 1.1)
    scene.add(atmosphere)
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

function addStars() {

    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff
    })
    const stars = new THREE.Points(starGeometry, starMaterial)
    const starVerticies: number[] = []
    for (let i = 0; i < 20000; i++) {
        const x = (Math.random() -0.5) * 2000
        const y = (Math.random() -0.5) * 2000
        const z = -Math.random() * 2000
        starVerticies.push(x, y, z)
    }

    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVerticies, 3))
    scene.add(stars)
}

function addSkyscrapers() {
    data.forEach(d => {
        const latlng = findLoc(d.country)
        addPointPrismOnEarth(latlng[0], latlng[1], d.country, d.customers)
    })
    // addPointPrismOnEarth(latme, lngme, "atle")
    // addPointPrismOnEarth(62, 10, "Norway")
    // addPointPrismOnEarth(19.446324014224473, -99.13188325511402, "Mexico")
    // addPointPrismOnEarth(71.18301404094616, -39.57334891124896, "Greenland")
    // addPointPrismOnEarth(-34.33083444904446, 18.50977885005987, "South Africa")
    // addPointPrismOnEarth(17.42632336685964, 78.29669360821666, "India")
    // addPointPrismOnEarth(-27.011764910945658, 136.8570329340568, "Australia")
    // addPointPrismOnEarth(18.089346806053346, -15.973812277073197, "Mauritania")
    // addPointPrismOnEarth(-33.66456622133675, -58.535725571563326, "Argentina")
}

function addPointOnEarth(lat: number, lng: number) {
    const latRad = (lat / 180) * Math.PI
    const lngRad = (lng / 180) * Math.PI

    const point = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshBasicMaterial({
            color: 0xFF0000
        })
    )
    const x = earthRadius * Math.cos(latRad) * Math.sin(lngRad)
    const y = earthRadius * Math.sin(latRad)
    const z = earthRadius * Math.cos(latRad) * Math.cos(lngRad)

    point.position.set(x, y, z)
    group.add(point)
}

function addPointPrismOnEarth(lat: number, lng: number, name: string, size: number) {
    const latRad = (lat / 180) * Math.PI
    const lngRad = (lng / 180) * Math.PI

    let height = size / 1000
    if (height < 0.4)
        height = 0.4
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.2, height),
        new THREE.MeshBasicMaterial({
            color: "#acd3ef",
            opacity: 0.6,
            transparent: true
        })
    )
    const x = earthRadius * Math.cos(latRad) * Math.sin(lngRad)
    const y = earthRadius * Math.sin(latRad)
    const z = earthRadius * Math.cos(latRad) * Math.cos(lngRad)

    box.position.set(x, y, z)
    box.lookAt(0, 0, 0)
    box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -height/2))
    box.name = `${name} <small>(${size})</small>`
    group.add(box)
}

// const lights = [0x111111, 0x222222, 0x333333, 0x444444, 0x555555, 0x666666, 0x777777, 0x888888, 0x999999, 0xAAAAAA, 0xBBBBBB, 0xCCCCCC, 0xDDDDDD, 0xEEEEEE, 0xFFFFFF]
// let color = 0
function animate() {

    // if (color == 255) color = 0
    // else color += 1
    // earthMaterial.color = new THREE.Color(`rgb(${color}, ${color}, ${color})`)
    lightBall.position.x += 0.04
    // group.rotation.y += 0.002
    group.rotation.y = mouse.x
    group.rotation.x = mouse.y

    raycaster.setFromCamera(pointer, camera)
    const allBoxes = group.children.filter(m => {
        const mesh = m as THREE.Mesh
        return mesh.geometry.type === "BoxGeometry"
    })
    allBoxes.forEach(b => {
        const box = b as THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>
        box.material.color = new THREE.Color("#76c3ed")
        box.material.opacity = 0.6
    })
    popup.style.display = "none"
    const intersects = raycaster.intersectObjects(allBoxes)
	for ( let i = 0; i < intersects.length; i ++ ) {
		const box = intersects[i].object as THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>
        box.material.color = new THREE.Color("#1c93d3")
        box.material.opacity = 1
        popup.style.display = "block"
        popup.innerHTML = `<span>${box.name}</span>`
	}
    // controls.update()

    renderer.render(scene, camera)
    anim = requestAnimationFrame(animate)
}
