let glsl = String.raw

const fragmentShader = glsl`

    uniform sampler2D globeTexture;

    varying vec2 vertexUV;
    varying vec3 vertexNormal;

    void main() {
        float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
        vec3 atmosphere = vec3(0.5, 0.6, 1.0) * pow(intensity, 1.5);

        // vec3(0.1, 0.1, 0.1)
        gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);
    }

`

export default fragmentShader