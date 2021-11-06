import { loadSvg } from "@app/services/svgMesh3d"

const pathTopLeft = "M 605,2813 C 358,2689 153,2586 151,2584 c -2,-2 2,-40 8,-86 63,-438 261,-909 533,-1265 410,-538 1023,-921 1665,-1043 202,-38 533,-65 533,-44 0,3 -105,212 -232,464 l -233,459 217,434 c 119,239 214,438 211,441 -4,3 -25,6 -48,6 -66,0 -224,44 -318,89 -202,97 -358,257 -472,486 -19,38 -35,47 -490,276 l -470,237 z"

export const initSvg = () => {
    const test = loadSvg(pathTopLeft)
    console.log(test)
}
