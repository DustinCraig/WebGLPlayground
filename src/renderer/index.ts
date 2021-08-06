import * as config from '../config/renderer'
import { GL, gl } from '../gl'

export abstract class Renderer {
    private static _isRunning: boolean
    private static _secondsPassed: number
    private static _lastTimeStamp: number
    private static _fps: number

    constructor() {}

    public static run() {
        this._isRunning = true
        window.requestAnimationFrame((d) => this._run(d))
    }

    public static stop() {
        this._isRunning = false
    }

    private static _run(timeStamp: number) {
        if (!this._isRunning) return
        this._secondsPassed = (timeStamp - this._lastTimeStamp) / 1000 // dt
        this._lastTimeStamp = timeStamp
        this._fps = Math.round(1 / this._secondsPassed)

        //Render geometry...

        GL.clear()
        gl.drawArrays(gl.POINTS, 0, 1)
        //
        window.requestAnimationFrame((d) => this._run(d))
    }
}
