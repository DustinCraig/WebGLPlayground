import { CLEAR_COLOR, WEBGL_CANVAS_NAME } from './config/gl'

export abstract class GL {
    private static _canvas: HTMLCanvasElement
    private static _gl: WebGL2RenderingContext
    private static _hasInitialized: boolean = false
    private static _canvasID: string

    public static init() {
        if (this._hasInitialized) return
        if (!WEBGL_CANVAS_NAME) throw new Error('GL: canvasID cannot be null or empty')
        const canvasID: string = WEBGL_CANVAS_NAME

        this._canvasID = canvasID

        let glCanvas = <HTMLCanvasElement>document.getElementById(canvasID)
        if (!glCanvas) {
            glCanvas = document.createElement('canvas')
            glCanvas.id = canvasID
        }
        this._canvas = glCanvas
        this._gl = <WebGL2RenderingContext>glCanvas.getContext('webgl2')
        console.log('in init ', this._gl)
        if (!this._gl) throw new Error('GL: Could not get WebGL2RenderingContext')

        this._gl.clearColor(...CLEAR_COLOR)
        document.body.appendChild(glCanvas)
        this._hasInitialized = true
    }

    /**
     * clear the color/depth buffers
     */
    public static clear(): void {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT)
    }

    /**
     * Set the size of the viewport (width, height)
     * @param width Viewport width
     * @param height Viewport height
     */
    public static setSize(width: number, height: number) {
        if (!width || width < 0 || !height || height < 0)
            throw new Error(`GL: Invalid viewport dimensions. Got ${width}, ${height}`)
        this._canvas.style.width = `${width}px`
        this._canvas.style.height = `${height}px`
        this._canvas.width = width
        this._canvas.height = height
        this._gl.viewport(0, 0, width, height)
    }

    public static getContext() {
        if (!this._hasInitialized) this.init()
        return this._gl
    }

    public static createAndFillBuffer(
        data: Float32Array,
        target: number = this._gl.ARRAY_BUFFER,
        isDynamic: boolean = false
    ) {
        const buffer = this._gl.createBuffer()
        this._gl.bindBuffer(target, buffer)
        this._gl.bufferData(target, data, isDynamic ? this._gl.DYNAMIC_DRAW : this._gl.STATIC_DRAW)
        this._gl.bindBuffer(target, null)
    }
}

export const gl = (() => GL.getContext())()
