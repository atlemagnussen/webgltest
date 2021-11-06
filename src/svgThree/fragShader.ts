const glsl = String.raw
const fragShader = glsl`
    uniform float animate;
    uniform float opacity;

    void main() {
    gl_FragColor = vec4(vec3(1.0), opacity);
    }
`
export default fragShader