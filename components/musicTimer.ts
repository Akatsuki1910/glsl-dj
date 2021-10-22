let node: AudioBufferSourceNode | undefined
let ctx: AudioContext

export function createNode() {
  if (!node) {
    ctx = new window.AudioContext()
    node = ctx.createBufferSource()
    node.connect(ctx.destination)
    node.loop = true
    node.buffer = ctx.createBuffer(2, ctx.sampleRate * 60, ctx.sampleRate)
    node.start(0)
  }
}

export function changeBPM(bpm: number) {
  if (node) {
    if (bpm > 0) {
      node.loopEnd = 60 / bpm
    }
  }
}

export function getTime() {
  return ctx.currentTime
}
