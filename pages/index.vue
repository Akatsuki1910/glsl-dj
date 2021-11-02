<template lang="pug">
  div.container
    .edi
      Editor(ref="sound")
    .mixer
      div
        | BPM
        input.bpm(type="number" min="1" step="1" v-model="bpm")
      .controller-wrap
        Controller(:editor='s1' :bpm='getBPM' :volume='vol1').controller
        Controller(:editor='s2' :bpm='getBPM' :volume='vol2').controller
      Slider(@volume="setVolume")
    .edi
      Editor(ref="sound2")
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import Editor from '../components/Editor.vue'
import { changeBPM } from '../components/musicTimer'
@Component({
  components: {
    Editor,
  },
})
export default class Index extends Vue {
  @Ref() sound!: Editor
  @Ref() sound2!: Editor

  s1: Editor | null = null
  s2: Editor | null = null
  bpm = 60
  vol1: number = 50
  vol2: number = 50

  get getBPM() {
    const bpm = +this.bpm
    changeBPM(bpm)
    return bpm
  }

  mounted() {
    this.s1 = this.sound
    this.s2 = this.sound2
  }

  setVolume(v: number) {
    this.vol1 = v
    this.vol2 = 100 - v
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

.mixer {
  width: 20vw;
}

.controller-wrap {
  display: flex;

  .container {
    flex: 1;
  }
}
</style>
