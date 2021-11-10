import * as THREE from "three"

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

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
// let controls: OrbitControls

let anim = 0

const earthRadius = 5
let group: THREE.Group
let moon: THREE.Mesh
let earth: THREE.Mesh
let earthMaterial: THREE.ShaderMaterial
const raycaster = new THREE.Raycaster()

// me lat: 58.95071797166171 lng: 5.697703979485407
const latme = 58.95071797166171
const lngme = 5.697703979485407

export const stop = () => {
    if (anim)
        cancelAnimationFrame(anim)
}
let popup: HTMLDivElement
export const setup = (canvas: HTMLCanvasElement, pop: HTMLDivElement) => {
    popup = pop
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
    camera.position.z = 15

    renderer.render(scene, camera)

    // controls = new OrbitControls(camera, canvas)
    // addSpaceBackground()
    addLight()
    addEarth()
    addSkyscrapers()
    addAtmosphere()
    addMoon()
    addStars()
    addPointerEvents()
    animate()
}

function addLight() {
    // const pointLight = new THREE.PointLight(0xFFFFFF)
    // pointLight.position.set(0, 20, 20)
    // scene.add(pointLight)

    const ambientLight = new THREE.AmbientLight(0xFFFFFF)
    scene.add(ambientLight)
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
    // earthMaterial = new THREE.MeshStandardMaterial({
    //     map: earthTexture
    // })
    earthMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            globeTexture: {
                value: earthTexture
            }
        }
    })
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
    addPointPrismOnEarth(latme, lngme, "atle")
    addPointPrismOnEarth(19.446324014224473, -99.13188325511402, "Mexico")
    addPointPrismOnEarth(71.18301404094616, -39.57334891124896, "Greenland")
    addPointPrismOnEarth(-34.33083444904446, 18.50977885005987, "South Africa")
    addPointPrismOnEarth(17.42632336685964, 78.29669360821666, "India")
    addPointPrismOnEarth(-27.011764910945658, 136.8570329340568, "Australia")
    addPointPrismOnEarth(18.089346806053346, -15.973812277073197, "Mauritania")
    addPointPrismOnEarth(-33.66456622133675, -58.535725571563326, "Argentina")
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

function addPointPrismOnEarth(lat: number, lng: number, name: string) {
    const latRad = (lat / 180) * Math.PI
    const lngRad = (lng / 180) * Math.PI

    const height = 0.8
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, height),
        new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            opacity: 0.3,
            transparent: true
        })
    )
    const x = earthRadius * Math.cos(latRad) * Math.sin(lngRad)
    const y = earthRadius * Math.sin(latRad)
    const z = earthRadius * Math.cos(latRad) * Math.cos(lngRad)

    box.position.set(x, y, z)
    box.lookAt(0, 0, 0)
    box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -height/2))
    box.name = name
    group.add(box)
}

// const lights = [0x111111, 0x222222, 0x333333, 0x444444, 0x555555, 0x666666, 0x777777, 0x888888, 0x999999, 0xAAAAAA, 0xBBBBBB, 0xCCCCCC, 0xDDDDDD, 0xEEEEEE, 0xFFFFFF]
// let color = 0
function animate() {

    // if (color == 255) color = 0
    // else color += 1
    // earthMaterial.color = new THREE.Color(`rgb(${color}, ${color}, ${color})`)
    
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
        box.material.opacity = 0.4
    })
    popup.style.display = "none"
    const intersects = raycaster.intersectObjects(allBoxes)
	for ( let i = 0; i < intersects.length; i ++ ) {
		const box = intersects[i].object as THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>
        box.material.opacity = 1
        popup.style.display = "block"
        popup.innerHTML = `<span>${box.name}</span>`
	}
    // controls.update()

    renderer.render(scene, camera)
    anim = requestAnimationFrame(animate)
}
