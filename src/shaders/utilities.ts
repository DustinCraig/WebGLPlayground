import { gl } from '../gl'

/**
 *
 * @param src Shader source
 * @param type Shader type (gl.VERTEX_SHADER|gl.FRAGMENT_SHADER)
 * @returns {WebGLShader} Newly created WebGLShader
 */
export const createShader = (src: string, type: number) => {
    try {
        const shader = <WebGLShader>gl.createShader(type)
        gl.shaderSource(shader, src)
        gl.compileShader(shader)

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader)
            throw new Error(
                `Could not compile shader: ${src}  SHADER_INFO_LOG: ${gl.getShaderInfoLog(shader)}`
            )
        }

        return shader
    } catch (err) {
        console.error(`SHADER UTILS (createShader): ${err.message}`)
        throw err
    }
}

/**
 * Create a shader program
 * @param vertexShader Compiled vertex shader
 * @param fragmentShader Compiled fragment shader
 * @returns {WebGLProgram} Newly created WebGLProgram
 */
export const createShaderProgram = (vertexShaderSource: string, fragmentShaderSource: string) => {
    const vertexShader = createShader(vertexShaderSource, gl.VERTEX_SHADER)
    const fragmentShader = createShader(fragmentShaderSource, gl.FRAGMENT_SHADER)
    return _createShaderProgram(vertexShader, fragmentShader)
}

const _createShaderProgram = (
    vertexShader: WebGLShader | null,
    fragmentShader: WebGLShader | null
) => {
    try {
        if (!vertexShader) throw new Error('Vertex shader is null or undefined')
        if (!fragmentShader) throw new Error('Fragment shader is null or undefined')

        const shaderProgram: WebGLProgram = <WebGLProgram>gl.createProgram()
        if (shaderProgram == null) throw new Error(`Could not create shader program`)

        gl.attachShader(shaderProgram, vertexShader)
        gl.attachShader(shaderProgram, fragmentShader)
        gl.linkProgram(shaderProgram)

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            gl.deleteProgram(shaderProgram)
            throw new Error(`Could not link shader program: ${gl.getProgramInfoLog(shaderProgram)}`)
        }

        gl.validateProgram(shaderProgram)
        if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
            gl.deleteProgram(shaderProgram)
            throw new Error(
                `Could not validate shader program ${gl.getProgramInfoLog(shaderProgram)}`
            )
        }

        // Do some preemptive cleanup...
        gl.detachShader(shaderProgram, vertexShader)
        gl.detachShader(shaderProgram, fragmentShader)
        gl.deleteShader(vertexShader)
        gl.deleteShader(fragmentShader)

        return shaderProgram
    } catch (err) {
        console.error(`SHADER UTILS (createShaderProgram): ${err.message}`)
        throw err
    }
}
