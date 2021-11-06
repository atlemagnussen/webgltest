import * as THREE from "three"
import ThreeSimplicalComples from "three-simplicial-complex"
const createGeom = ThreeSimplicalComples(THREE)
// import Tweenr from 'tweenr'

//import createLoop from 'canvas-loop'
//import loadSvg from 'load-svg'
//import { parse as getSvgPaths } from 'extract-svg-path'

import glVec3 from 'gl-vec3'
import triangleCentroid from 'triangle-centroid'
import reindex from 'mesh-reindex'
import unindex from 'unindex-mesh'

import { loadSvg3d } from "@app/svgThree/svgMesh3d"

import vertShader from "./vertShader"
import fragShader from "./fragShader"


let scene: THREE.Scene
// let tweenr: any

const pathTopLeft = "M 605,2813 C 358,2689 153,2586 151,2584 c -2,-2 2,-40 8,-86 63,-438 261,-909 533,-1265 410,-538 1023,-921 1665,-1043 202,-38 533,-65 533,-44 0,3 -105,212 -232,464 l -233,459 217,434 c 119,239 214,438 211,441 -4,3 -25,6 -48,6 -66,0 -224,44 -318,89 -202,97 -358,257 -472,486 -19,38 -35,47 -490,276 l -470,237 z"

export const initSvg = (canvas: HTMLCanvasElement) => {
    // canvas.addEventListener('touchstart', (ev) => ev.preventDefault())
    // canvas.addEventListener('contextmenu', (ev) => ev.preventDefault())

    // tweenr = Tweenr({ defaultEase: 'expoOut' })

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x97c2c5, 1)
    scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100)
    camera.position.set(0, 0, 5)
    let pointer = 0

    renderSVG(pathTopLeft, 1 ,1)
    // createApp()
}

    
function renderSVG (svgPath: string, delay: number, pointer: number) {
    delay = delay || 0
    
    const wireframe = pointer % 2 === 0

    
    let complex = loadSvg3d(svgPath, {
    scale: 10,
    simplify: 0.01
    // play with this value for different aesthetic
    // randomization: 500, 
    })
    
    // split mesh into separate triangles so no vertices are shared
    complex = reindex(unindex(complex.positions, complex.cells))
    
    // we will animate the triangles in the vertex shader
    const attributes = getAnimationAttributes(complex.positions, complex.cells)
    
    // build a ThreeJS geometry from the mesh primitive
    const geometry = new createGeom(complex)
    
    // our shader material
    const material = new THREE.ShaderMaterial({
        
        side: THREE.DoubleSide,
        vertexShader: vertShader,
        fragmentShader: fragShader,
        wireframe: wireframe,
        transparent: true,
        
        uniforms: {
            opacity: {
                value: 1
            },
            scale: {
                value: 0
            },
            animate: {
                value: 0
            }
        }
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    const interval = 2 + delay
    
    // explode in
    // tweenr.to(material.uniforms.animate, {
    //     value: 1, duration: 1.5, delay: delay, ease: 'expoInOut'
    // })
    // tweenr.to(material.uniforms.scale, {
    //     value: 1, duration: 1, delay: delay
    // })

    // // explode out
    // tweenr.to(material.uniforms.scale, {
    //     delay: interval, value: 0, duration: 0.75, ease: 'expoIn'
    // })
    // tweenr.to(material.uniforms.animate, {
    //     duration: 0.75, value: 0, delay: interval
    // }).on('complete', () => {
    //     geometry.dispose()
    //     geometry.vertices.length = 0
    //     scene.remove(mesh)
    //nextSvgMesh()
    //})
}

function getAnimationAttributes (positions: any[], cells: any[]) {
    const directions = []
    const centroids = []
    for (let i=0; i<cells.length; i++) {
        const [ f0, f1, f2 ] = cells[i]
        const triangle = [ positions[f0], positions[f1], positions[f2] ]
        const center = triangleCentroid(triangle)
        const dir = new THREE.Vector3().fromArray(center)
        centroids.push(dir, dir, dir)
        
        const random = glVec3.random([], Math.random())
        const anim = new THREE.Vector3().fromArray(random)
        directions.push(anim, anim, anim)
    }
    return {
        direction: { type: 'v3', value: directions },
        centroid: { type: 'v3', value: centroids }
    }
}
    
// function createApp () {
//   const app = createLoop(canvas, { scale: renderer.devicePixelRatio })
//     .start()
//     .on('tick', render)
//     .on('resize', resize)

//   function resize () {
//     var [ width, height ] = app.shape
//     camera.aspect = width / height
//     renderer.setSize(width, height, false)
//     camera.updateProjectionMatrix()
//     render()
//   }
  
//   function render () {
//     renderer.render(scene, camera)
//   }
  
//   resize()
// }