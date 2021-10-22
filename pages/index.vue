<template lang="pug">
  div.container
    .edi
      Ace(ref="sound")
    .mixer
      div
        | BPM
        input.bpm(type="number" min="1" step="1" v-model="bpm")
      .controller-wrap
        Controller(:editor='s1' :bpm='getBPM').controller
        Controller(:editor='s2' :bpm='getBPM').controller
    .edi
      Ace(ref="sound2")
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import Ace from '../components/Ace.vue'
import { changeBPM } from '../components/musicTimer'
@Component({
  components: {
    Ace,
  },
})
export default class Index extends Vue {
  @Ref() sound!: Ace
  @Ref() sound2!: Ace

  s1: Ace | null = null
  s2: Ace | null = null
  bpm = 60

  get getBPM() {
    const bpm = +this.bpm
    changeBPM(bpm)
    return bpm
  }

  mounted() {
    this.s1 = this.sound
    this.s2 = this.sound2
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
