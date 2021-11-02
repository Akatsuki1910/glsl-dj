import * as THREE from 'three'

export default class Music {
  width: number
  height: number
  canvas: HTMLCanvasElement
  duration: number
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.WebGLRenderer
  wctx: WebGLRenderingContext
  audioBuffer: AudioBuffer | undefined
  node: AudioBufferSourceNode | undefined
  gainNode: GainNode | undefined
  volume: number = 100
  constructor() {
    this.width = 512
    this.height = 512
    this.duration = 60

    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    })
    this.wctx = this.renderer.getContext()
    this.scene = new THREE.Scene()
    this.camera = new THREE.Camera()
    const target = new THREE.WebGLRenderTarget(this.width, this.height)
    this.renderer.setRenderTarget(target)
  }

  setFrag(s: string) {
    this.node?.disconnect()

    const ctx = new window.AudioContext()
    this.gainNode = ctx.createGain()
    this.node = ctx.createBufferSource()
    this.node.connect(ctx.destination)
    this.node.loop = true
    this.audioBuffer = ctx.createBuffer(
      2,
      ctx.sampleRate * this.duration,
      ctx.sampleRate,
    )

    this.node.connect(this.gainNode)
    this.gainNode.connect(ctx.destination)
    this.changeVolume()

    const uniforms = {
      iBlockOffset: { type: 'f', value: 0.0 },
      iSampleRate: { type: 'f', value: ctx.sampleRate },
    }
    const material = new THREE.ShaderMaterial({
      uniforms,
      fragmentShader: s,
    })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    this.scene.add(plane)

    const samples = this.width * this.height
    const numBlocks = (ctx.sampleRate * this.duration) / samples
    for (let i = 0; i < numBlocks; i++) {
      // Update uniform & Render
      uniforms.iBlockOffset.value = (i * samples) / ctx.sampleRate
      this.renderer.render(this.scene, this.camera)

      // Read pixels
      const pixels = new Uint8Array(this.width * this.height * 4)
      this.wctx.readPixels(
        0,
        0,
        this.width,
        this.height,
        this.wctx.RGBA,
        this.wctx.UNSIGNED_BYTE,
        pixels,
      )

      // Convert pixels to samples
      const outputDataL = this.audioBuffer.getChannelData(0)
      const outputDataR = this.audioBuffer.getChannelData(1)
      for (let j = 0; j < samples; j++) {
        outputDataL[i * samples + j] =
          ((pixels[j * 4 + 0] + 256 * pixels[j * 4 + 1]) / 65535) * 2 - 1
        outputDataR[i * samples + j] =
          ((pixels[j * 4 + 2] + 256 * pixels[j * 4 + 3]) / 65535) * 2 - 1
      }
    }
  }

  setVolume(v: number) {
    this.volume = v
    if (this.node) {
      this.changeVolume()
    }
  }

  changeVolume() {
    this.gainNode!.gain.value = this.volume / 100 - 1
  }

  pp(t: number) {
    this.node!.buffer = this.audioBuffer!
    const time = t % this.node!.loopEnd
    this.node!.start(0, time)
  }
}
