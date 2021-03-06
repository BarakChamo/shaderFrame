import triangle from 'a-big-triangle'
import context from 'gl-context'
import Shader from 'gl-shader'
import createTexture from 'gl-texture2d'

import presets from '../presets'

const transparentPixel = new Image()
transparentPixel.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='

const vert = `
attribute vec2 position;
varying vec2 texCoord;

void main() {
	gl_Position = vec4(position, 1, 1);
	texCoord = vec2(0.0,1.0)+vec2(0.5,-0.5) * (position + 1.0);
}
`.trim()

const noOp = () => {}

class ShaderFrame {
	constructor({ tex, background = transparentPixel, fx, canvas, params = {}, updateHook = noOp, debug = false,  clear = false, onClear = noOp, onDone = noOp, format = 'RGBA' }) {
		this.position = 0.0
		this.target = 0.0
		this.duration = 1.0
		this.startTime = Date.now()
		this.debug = debug
		this.clear = clear
		this.onClear = onClear
		this.onDone = onDone
		this.format = format
		
		const canvasElm = canvas || document.createElement('canvas')
		canvasElm.style = 'position: absolute; top: 0px; left: 0px;'
		const containsCanvas = canvasElm.isConnected
		const containsTex = tex.isConnected
		this.canvas = containsCanvas ? canvas : (containsTex ? tex.parentElement : document.body).appendChild(canvasElm)

		this.gl = context(this.canvas)
		this.updateHook = updateHook

		// configure shader
		this.setEffect(fx, params)

		// Listen for window resize
		window.addEventListener('resize', this.fit, false)

		// Create empty initial texture
		this.texture = createTexture(this.gl, [1,1], this.gl[this.format])
		this.backgroundTexture = createTexture(this.gl, [1,1], this.gl[this.format])

		// Start animation
		this.tick()

		this.setTextures(tex, background)
	}

	/*
	** Render methods
	**/ 

	tick = () => {
		if(this._lost) return

		const frac = (Date.now() - this.startTime + 0.000001) / this.duration

		this.position = this.target ? frac : 1.0 - frac
		this.position = Math.max(Math.min(this.position, 1.0), 0.0)

		this.render()

		if ((this.target && this.position < 1.0) || (!this.target && this.position > 0.0))
			window.requestAnimationFrame(this.tick)
		else {
			if(this._running) {
				this.onDone()

				if(this.clear)
					this.lose()
			}
		}
	}

	render = () => {
    const width  = this.gl.drawingBufferWidth
    const height = this.gl.drawingBufferHeight
    this.gl.viewport(0, 0, width, height)

		this.shader.bind()
		Object.assign(this.shader.uniforms, this.params)
		this.shader.uniforms.uTexture = this.texture.bind(0)

		if(this.backgroundTexture) this.shader.uniforms.uBackgroundTexture = this.backgroundTexture.bind(1)
		this.shader.uniforms.uPosition = this.position
		this.shader.uniforms.uScreenSize = [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]
		this.shader.uniforms.uTime = Date.now() - this.startTime

    this.updateHook(this.gl, this.shader)
    triangle(this.gl)
	}

	loadTexture = (tex, backgroundTex) => {
		this.texElm = tex
		this.backgroundTexElm = backgroundTex
		
		this.setLoadHandler(tex, this.onTextureLoaded)
		
		if(backgroundTex)
			this.setLoadHandler(backgroundTex, this.onBackgroundLoaded)
	}

	setLoadHandler = (tex, handler) => {
		if(tex instanceof HTMLImageElement) {
			tex.onload = handler
			if(tex.complete) handler()
		} else if (tex instanceof HTMLVideoElement) {
			if(tex.readyState > 3) handler()
			tex.canplay = handler
		}
	}

	onTextureLoaded = () => {
		this.fit()

		if(!this._loaded)
			this.texture = createTexture(this.gl, this.texElm, this.gl[this.format])

			this._resolve()

		if(this.debug) console.info('Shader Frame: Texture Loaded.', this._loaded, this.texture)
	}

	onBackgroundLoaded = () => {
		

		if(!this._bgloaded)
			this.backgroundTexture = createTexture(this.gl, this.backgroundTexElm, this.gl[this.format])

		this._bgloaded = true

		if(this.debug) console.info('Shader Frame: Background texture Loaded.', this._loaded, this.backgroundTexture)

		this.tick()
	}

	updateTexture() {

	}

	setTarget = (to, duration) => {
		if(this.debug) console.info('Shader Frame: Target set.', to, duration)
		this.duration = duration
		this.position = 1.0 - to;
		this.target = to
		this.startTime = Date.now()

		this.tick()
	}

	fit = () => {
		if(this._lost) return

		const imageInDocument = this.texElm.isConnected
		window.tex = this.texElm
		this.canvas.width = imageInDocument ? this.texElm.offsetWidth : this.canvas.offsetWidth
		this.canvas.height = imageInDocument ? this.texElm.offsetHeight : (this.texElm.width / this.texElm.height) * this.canvas.offsetWidth

		this.canvas.style.width = null
		this.canvas.style.height = null

		this.tick()
	}

	lose = () => {
		if(this.debug) console.info('Shader Frame: Clearning GL context.')
		
		// unbind textures
		if (this.texture) this.texture.dispose()
		if (this.backgroundTexture) this.backgroundTexture.dispose()
		
		// Lose gl context
		// const extension = this.gl.getExtension('WEBGL_lose_context')
		// if(extension) extension.loseContext()

		this.onClear()

		// clear refs
		// this.gl = null

		this._lost = true

		// clear canvas
	}

	restore() {
		
	}

	/*
	** API Methods
	**/ 
	enter = (duration = 2000) => {
		this._running = true
		
		if(this.debug) console.info('Shader Frame: Enter.', this._loaded)
		if(this._loaded)
			this.setTarget(1.0, duration * 1.0)
		else
			this.loadedPromise.then(() => {
				if(this.debug) console.info('Shader Frame: load then() called.', this._loaded)
				this.setTarget(1.0, duration * 1.0)
			})
	}

	exit= (duration = 2000) => {
		if(this.debug) console.info('Shader Frame: Exit.')
		this.setTarget(0.0, duration * 1.0)
	}

	setEffect = (frag, params) => {
		this.shader = this.shader = Shader(this.gl, vert, frag[0])
		this.shader.attributes.position.location = 0
		this.params = {...frag[1], ...params}
	}

	setTextures = (tex, background = transparentPixel) => {
		this._loaded = false
		this._resolve
		this.loadedPromise = new Promise(resolve => {
			this._resolve = () => {
				if(this.debug) console.log('Shader Frame: resolving load promise.')
				this._loaded = true
				resolve(true)
			}
		})

		// Load passed texture
		this.loadTexture(tex, background)
	}
}

ShaderFrame.FX = presets
export default ShaderFrame
export { ShaderFrame as ShaderFrame }
export { presets as FX }