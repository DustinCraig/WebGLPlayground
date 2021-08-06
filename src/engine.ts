import { WEBGL_CANVAS_NAME } from './config/gl'
import { TEST_FRAGMENT_SHADER, TEST_VERTEX_SHADER } from './config/shader'
import { GL, gl } from './gl'
import { Renderer } from './renderer'
import { createShader, createShaderProgram } from './shaders/utilities'

const init = () => {
    try {
        GL.init()
        GL.setSize(window.innerWidth, window.innerHeight)
        console.info('ENGINE: Successfully initialized engine...')

        const shaderProgram = createShaderProgram(TEST_VERTEX_SHADER, TEST_FRAGMENT_SHADER)
        const aPosLocation = gl.getAttribLocation(shaderProgram, 'aPos')
        const buffer = gl.createBuffer()
        const vertices = new Float32Array([0.1, 0.1, 0])

        // Rendering...
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        gl.useProgram(shaderProgram)
        gl.enableVertexAttribArray(aPosLocation)
        gl.vertexAttribPointer(aPosLocation, 3, gl.FLOAT, false, 0, 0)
        Renderer.run()
    } catch (error) {
        console.error(`ENGINE: Initialization failed...${error.message}`)
    }
}

const resize = () => {
    GL.setSize(window.innerWidth, window.innerHeight)
}

const unload = () => {
    window.removeEventListener('load', init)
    window.removeEventListener('resize', resize)
}

window.addEventListener('load', init)
window.addEventListener('resize', resize)
window.addEventListener('unload', unload)
