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

interface BrowserRoute {
    path: string
    param: string
    action: string
}
interface Route {
    path: string
    component: string
    title?: string
    description?: string
    param?: string
    action?: string
    mustBeLoggedIn?: boolean
    admin?: boolean
    init?: Function
}
