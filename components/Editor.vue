<template lang="pug">
  .editor-wrap
    .edi
      Ace(ref="sound")
    .btn-wrap
      button.btn(@click='mcompile')
        fa(:icon='faMusic')
      button.btn(:disabled="!mFlag" @click='start')
        fa(:icon='faPlay')
      | BPM
      input.bpm(type="number" min="0" step="1" v-model="bpm")
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from 'nuxt-property-decorator'
import {
  faHammer,
  faRedo,
  faMusic,
  faPlay,
} from '@fortawesome/free-solid-svg-icons'
import Ace from './Ace.vue'
import Music from './music'
import soundShader from './glsl/sound/sound.frag'
import soundmainShader from './glsl/sound/soundmain.frag'
import sounddefinitionShader from './glsl/sound/sounddefinition.frag'
@Component({
  components: {
    Ace,
  },
})
export default class Editor extends Vue {
  @Ref() sound!: Ace
  gl: WebGLRenderingContext | null = null
  music = new Music()
  mFlag = false
  bpm = 60
  // computed()
  get getBPM() {
    return +this.bpm
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
    this.music.duration = 60 / bpm
    this.music.node?.stop()
    this.mFlag = false
  }

  // mounted()
  mounted() {
    this.sound.setValue(soundShader)
  }

  // methods()
  mcompile() {
    const ss =
      sounddefinitionShader + this.sound.editor.getValue() + soundmainShader
    this.mFlag = this.compileCheck(ss)
    if (this.mFlag) {
      this.music.setFrag(ss)
    }
  }

  start() {
    this.mFlag = false
    this.music.pp()
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

  repeat() {
    this.$nuxt.$emit('repeat', 0)
  }
}
</script>

<style lang="scss" scoped>
.edi {
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: calc(100vh - 2rem);
}
.btn-wrap {
  height: 2rem;
  background-color: #7a7a7a;
}
.btn {
  background-color: transparent;
}
.bpm {
  width: 4rem;
}
</style>
