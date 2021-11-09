let glsl = String.raw

const shader = glsl`
    varying vec3 vertexNormal;

    void main() {
        vertexNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`

export default shader