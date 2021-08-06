export const TEST_VERTEX_SHADER: string = `#version 300 es

in vec3 aPos;

uniform float uPointSize;

void main(void) {
    gl_PointSize = uPointSize;
    gl_Position = vec4(aPos, 1.0);
}
`

export const TEST_FRAGMENT_SHADER: string = `#version 300 es
precision mediump float;

out vec4 finalColor;

void main(void) {
    finalColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`
