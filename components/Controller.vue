<template lang="pug">
  div.controller
    button.btn(@click='mcompile')
      fa(:icon='faMusic')
    button.btn(:disabled="!mFlag" @click='start')
      fa(:icon='faPlay')
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import {
  faHammer,
  faRedo,
  faMusic,
  faPlay,
} from '@fortawesome/free-solid-svg-icons'
import Music from '../components/music'
import soundShader from '../components/glsl/sound/sound.frag'
import soundmainShader from '../components/glsl/sound/soundmain.frag'
import sounddefinitionShader from '../components/glsl/sound/sounddefinition.frag'
import Editor from './Editor.vue'
import { createNode, getTime } from './musicTimer'
@Component({})
export default class Controller extends Vue {
  @Prop({ type: Editor }) readonly editor!: Editor
  @Prop({ type: Number }) readonly bpm!: number
  @Prop({ type: Number }) readonly volume!: number

  private gl: WebGLRenderingContext | null = null
  private music = new Music()
  private mFlag = false

  // computed()
  get getBPM() {
    return this.bpm
  }

  get getVolume() {
    return this.volume
  }

  get faHammer() {
    return faHammer
  }

  get faRedo() {
    return faRedo
  }

  get faMusic() {
    return faMusic
  }

  get faPlay() {
    return faPlay
  }

  @Watch('getBPM')
  setBPM(bpm: number) {
    if (this.music.node) {
      if (bpm > 0) {
        this.music.node.loopEnd = 60 / bpm
      }
    }
  }

  @Watch('getVolume')
  setVolume(volume: number) {
    this.music.setVolume(volume)
  }

  @Watch('editor', { immediate: true })
  setValue(ace: Editor) {
    if (ace) {
      ace.setValue(soundShader)
    }
  }

  // methods()
  mcompile() {
    const ss =
      sounddefinitionShader + this.editor!.editor.getValue() + soundmainShader
    this.mFlag = this.compileCheck(ss)
    if (this.mFlag) {
      this.music.setFrag(ss)
    }
  }

  start() {
    this.mFlag = false
    createNode()
    this.setBPM(this.bpm)
    this.music.pp(getTime())
  }

  compileCheck(s: string) {
    let rFrag = false
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    if (!this.gl) {
      this.gl = canvas.getContext('webgl')!
    }
    const gl = this.gl!
    const k = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(k, s)
    gl.compileShader(k)
    if (!gl.getShaderParameter(k, gl.COMPILE_STATUS)) {
      window.alert(gl.getShaderInfoLog(k))
    } else {
      rFrag = true
    }
    return rFrag
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
}

.edi {
  display: flex;
  flex-direction: column;
  width: 40vw;
  height: 100vh;
}

.controller {
  width: 20vw;
}

.btn {
  background-color: transparent;
}
.bpm {
  width: 4rem;
}
</style>
