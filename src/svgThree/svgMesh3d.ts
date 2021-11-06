
import { parse } from "@app/libs/parseSvgPath"
//import parse from "parse-svg-path"


import getContours from "svg-path-contours"
import simplify from "simplify-path"
import getBounds from "bound-points"
import randomFloat from "random-float"
// import cleanPslg from "clean-pslg"
import cdt2d from "cdt2d"
import normalize from  "normalize-path-scale"
// import {SVGPathData} from "svg-pathdata" // SVGPathDataTransformer, SVGPathDataEncoder, SVGPathDataParser

let defaultOptions: SvgMesh3dOptions = {
    delaunay: true,
    clean: true,
    exterior: true,
    randomization: 0,
    simplify: 0,
    scale: 1
}

export const loadSvg3d = (path: string, opts?: SvgMesh3dOptions) => {
    const options = Object.assign(defaultOptions, opts)

    const parsed = parse(path)
    const contours = getContours(parsed, options.scale)

    if (options.simplify! > 0) {
        for (let i = 0; i < contours.length; i++) {
          contours[i] = simplify(contours[i], options.simplify)
        }
    }

    const polyline = denestPolyline(contours)
    const positions = polyline.positions
    const bounds = getBounds(positions)

    if (options.randomization! > 0) {
        addRandomPoints(positions, bounds, options.randomization!)
    }

    let loops = polyline.edges
    let edges = []
    for (let i = 0; i < loops.length; ++i) {
        var loop = loops[i]
        for (let j = 0; j < loop.length; ++j) {
            edges.push([loop[j], loop[(j + 1) % loop.length]])
        }
    }

    // if (options.clean) {
    //     cleanPslg(positions, edges)
    // }

    let cells = cdt2d(positions, edges, options)
     // rescale to [-1 ... 1]
    normalize(positions, bounds)

    to3D(positions)

    return {
        positions: positions,
        cells: cells
    }
}


function to3D (positions:any[]) {
    for (var i = 0; i < positions.length; i++) {
        var xy = positions[i]
        xy[1] *= -1
        xy[2] = xy[2] || 0
    }
}
  

function addRandomPoints (positions:any[], bounds:any, count:number) {
    var min = bounds[0]
    var max = bounds[1]
  
    for (var i = 0; i < count; i++) {
        positions.push([ // random [ x, y ]
            randomFloat(min[0], max[0]),
            randomFloat(min[1], max[1])
        ])
    }
}

function denestPolyline (nested: any) {
    let positions = []
    let edges = []
  
    for (var i = 0; i < nested.length; i++) {
        var path = nested[i]
        var loop = []
        for (let j = 0; j < path.length; j++) {
            let pos = path[j]
            let idx = positions.indexOf(pos)
            if (idx === -1) {
                positions.push(pos)
                idx = positions.length - 1
            }
            loop.push(idx)
      }
      edges.push(loop)
    }
    return {
        positions: positions,
        edges: edges
    }
}