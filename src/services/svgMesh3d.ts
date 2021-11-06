import parse from "parse-svg-path"
import getContours from "svg-path-contours"
import simplify from "simplify-path"
import getBounds from "bound-points"
import randomFloat from "random-float"

// import {SVGPathData} from "svg-pathdata" // SVGPathDataTransformer, SVGPathDataEncoder, SVGPathDataParser

let options = {
    delaunay: true,
    clean: true,
    exterior: false,
    randomization: 0,
    simplify: 0,
    scale: 1
}

const pathTopLeft = "M 605,2813 C 358,2689 153,2586 151,2584 c -2,-2 2,-40 8,-86 63,-438 261,-909 533,-1265 410,-538 1023,-921 1665,-1043 202,-38 533,-65 533,-44 0,3 -105,212 -232,464 l -233,459 217,434 c 119,239 214,438 211,441 -4,3 -25,6 -48,6 -66,0 -224,44 -318,89 -202,97 -358,257 -472,486 -19,38 -35,47 -490,276 l -470,237 z"

export const loadSvg = async (path: string) => {
    const parsed = parse(path)
    console.log(parsed)
    const contours = getContours(parsed, options.scale)

    if (options.simplify > 0) {
        for (let i = 0; i < contours.length; i++) {
          contours[i] = simplify(contours[i], options.simplify)
        }
    }

    const polyline = denestPolyline(contours)
    const positions = polyline.positions
    const bounds = getBounds(positions)

    if (options.randomization > 0) {
        addRandomPoints(positions, bounds, options.randomization)
    }
}
loadSvg(pathTopLeft)

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