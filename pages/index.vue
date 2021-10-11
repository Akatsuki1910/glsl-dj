<template lang="pug">
  div.container
    .edi
      Ace(ref="sound")
    .controller
      div
        | BPM
        input.bpm(type="number" min="1" step="1" v-model="bpm")
      Controller(:editor='s1' :bpm='getBPM')
      Controller(:editor='s2' :bpm='getBPM')
    .edi
      Ace(ref="sound2")
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import Ace from '../components/Ace.vue'
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
    return +this.bpm
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

.controller {
  width: 20vw;
}
</style>
