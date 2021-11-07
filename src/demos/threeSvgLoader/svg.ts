import * as THREE from "three"
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader"

const fillMaterial = new THREE.MeshBasicMaterial({ color: "#1c93d3" })
const stokeMaterial = new THREE.LineBasicMaterial({
    color: "#acd3ef",
})

interface UpdateMapItem {
    shape: THREE.Shape
    mesh: THREE.Mesh<THREE.ExtrudeGeometry>
    lines: THREE.LineSegments<THREE.EdgesGeometry<THREE.ExtrudeGeometry>, THREE.LineBasicMaterial>
}

export const renderSVG = async (extrusion: number, svgUrl: string) => {
    const loader = new SVGLoader()
    // const svgData = loader.parse(svg)

    const svgGroup = new THREE.Group()
    // svgGroup.scale.y *= -
    
    svgGroup.scale.y = -0.002
    svgGroup.scale.x = 0.002
    const updateMap: UpdateMapItem[] = []

    const svgData = await loader.loadAsync(svgUrl)
  
    svgData.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);

        shapes.forEach((shape) => {
            const meshGeometry = new THREE.ExtrudeBufferGeometry(shape, {
                depth: extrusion,
                bevelEnabled: false,
            })
            const linesGeometry = new THREE.EdgesGeometry(meshGeometry)
            const mesh = new THREE.Mesh(meshGeometry, fillMaterial)
            const lines = new THREE.LineSegments(linesGeometry, stokeMaterial)

            updateMap.push({ shape, mesh, lines })
            svgGroup.add(mesh, lines)
        })
    })

    const box = new THREE.Box3().setFromObject(svgGroup)
    const size = box.getSize(new THREE.Vector3())
    // const yOffset = size.y * -1000
    // const xOffset = size.x * -2000

    // // Offset all of group's elements, to center them
    // svgGroup.children.forEach((item) => {
    //     item.position.x = xOffset
    //     item.position.y = yOffset
    // })
    // svgGroup.rotateX(-Math.PI / 2)

    return {
        object: svgGroup,
        update(extrusion: number) {
            updateMap.forEach((updateDetails) => {
                const meshGeometry = new THREE.ExtrudeBufferGeometry(
                    updateDetails.shape,
                    {
                        depth: extrusion,
                        bevelEnabled: true,
                        bevelThickness: 2,
                        bevelSize: 3,
                        bevelOffset: 5
                    }
                )
                const linesGeometry = new THREE.EdgesGeometry(meshGeometry)

                updateDetails.mesh.geometry.dispose();
                updateDetails.lines.geometry.dispose();
                updateDetails.mesh.geometry = meshGeometry;
                updateDetails.lines.geometry = linesGeometry;
            })
        }
    }
}
