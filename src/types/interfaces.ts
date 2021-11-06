interface GlBuffers {
    position: WebGLBuffer | null
    color: WebGLBuffer | null
    indices: WebGLBuffer | null
}

interface SvgMesh3dOptions {
    delaunay?: boolean
    clean?: boolean
    exterior?: boolean
    randomization?: number
    simplify?: number
    scale?: number
}