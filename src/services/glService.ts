let vertexShaderSource = ""
let fragmentShaderSource = ""
let glContext: WebGLRenderingContext

export function doSetup(canvas: HTMLCanvasElement) {

    glContext = canvas.getContext("webgl")

    const vertesxShader2dEl = document.querySelector("#vertex-shader-2d") as HTMLScriptElement
    vertexShaderSource = vertesxShader2dEl.text

    const fragmentShader2dEl = document.querySelector("#fragment-shader-2d") as HTMLScriptElement
    fragmentShaderSource = fragmentShader2dEl.text;
    
    const vertexShader = createShader(glContext, glContext.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(glContext, glContext.FRAGMENT_SHADER, fragmentShaderSource)

    const program = createProgram(glContext, vertexShader, fragmentShader)
    const positionAttributeLocation = glContext.getAttribLocation(program, "a_position")
    const positionBuffer = glContext.createBuffer()
    glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer)

    // three 2d points
    const positions = [
        0, 0,
        0, 0.5,
        0.7, 0,
    ]
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(positions), glContext.STATIC_DRAW)

    // webglUtils.resizeCanvasToDisplaySize(gl.canvas)
    glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height)
    // Clear the canvas
    glContext.clearColor(0, 0, 0, 0)
    glContext.clear(glContext.COLOR_BUFFER_BIT)

    glContext.useProgram(program)

    glContext.enableVertexAttribArray(positionAttributeLocation)

    // Bind the position buffer.
    glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer)
    
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2                 // 2 components per iteration
    const type = glContext.FLOAT   // the data is 32bit floats
    const normalize = false        // don't normalize the data
    const stride = 0               // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0                 // start at the beginning of the buffer
    glContext.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

    const primitiveType = glContext.TRIANGLES
    offset = 0
    const count = 3
    glContext.drawArrays(primitiveType, offset, count)

}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
        return program
    }
   
    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}