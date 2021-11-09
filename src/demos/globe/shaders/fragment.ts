let glsl = String.raw

const fragmentShader = glsl`

    uniform sampler2D globeTexture;

    varying vec2 vertexUV;

    void main() {
        
        gl_FragColor = texture2D(globeTexture, vertexUV);
    }

`

export default fragmentShader