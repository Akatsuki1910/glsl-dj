<template lang="pug">
  div(ref="range").range
    div(ref="rangeGroove").range-groove
      div(ref="rangeGrooveBefore" :style="('width:'+ rgbWidth +'px')").range-groove-before
    div(ref="rangeKnob" :style="('left:'+ rkL +'px')" @mousedown="knobMouseDown").range-knob
</template>

<script lang="ts">
import { Component, Emit, Ref, Vue, Watch } from 'nuxt-property-decorator'
@Component({})
export default class Slider extends Vue {
  @Ref() range!: HTMLDivElement
  @Ref() rangeGroove!: HTMLDivElement
  @Ref() rangeGrooveBefore!: HTMLDivElement
  @Ref() rangeKnob!: HTMLDivElement

  dMin = 0
  dMax = 100
  dValue = 0

  rkL = 0

  grooveClick = false
  mousePosimem = 0
  rgbW = 0

  rotateFlg = false

  v = 0

  get rgbWidth() {
    return this.rkL
  }

  @Emit('volume')
  volume() {
    return this.v
  }

  @Watch('v', { immediate: true })
  changeVolume() {
    this.volume()
  }

  mounted() {
    const min = this.dMin || 0
    const max = this.dMax || 100
    const value = this.dValue || 50
    const minValue = this.returnWidth(this.rangeKnob) / 2
    const maxValue = this.returnWidth(this.rangeGroove) - minValue * 2
    this.rkL = maxValue * Math.min(1, value / (max - min)) + minValue
    this.v = ((this.rkL - minValue) / maxValue) * (max - min) + min

    window.onmousemove = (e: MouseEvent) => {
      if (this.grooveClick) {
        const kwidth = this.returnWidth(this.rangeKnob)
        const posi = this.rotateFlg
          ? -e.clientY + this.mousePosimem
          : e.clientX - this.mousePosimem
        let rkL = this.rgbW + posi
        if (rkL + kwidth / 2 > this.returnWidth(this.rangeGroove)) {
          rkL = this.returnWidth(this.rangeGroove) - kwidth / 2
        } else if (rkL < kwidth / 2) {
          rkL = kwidth / 2
        }

        this.rkL = rkL

        this.v = ((rkL - minValue) / maxValue) * (max - min) + min
      }
    }

    window.onmouseup = () => {
      this.grooveClick = false
    }
    window.onmouseleave = () => {
      this.grooveClick = false
    }
  }

  returnWidth(dom: HTMLDivElement) {
    return dom.getBoundingClientRect().width
  }

  knobMouseDown(e: MouseEvent) {
    this.grooveClick = true
    this.mousePosimem = this.rotateFlg ? e.clientY : e.clientX
    this.rgbW = this.returnWidth(this.rangeGrooveBefore)
  }
}
</script>

<style lang="scss" scoped>
$border-heigth: 8px;
$border-width: 129px;
$knob-heigth: 15.5px;

.range {
  margin: 0 auto;
  height: $knob-heigth;
  width: $border-width;
  position: relative;

  // top:calc(#{$border-width});
  // transform: rotate(-90deg);
  .range-groove {
    box-sizing: border-box;
    width: $border-width;
    height: $border-heigth;
    border-radius: $border-heigth;
    background-color: rgb(239, 239, 239);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: 0.000005px solid rgb(178, 178, 178);

    .range-groove-before {
      background-color: rgb(0, 117, 255);
      width: calc(#{$border-width} / 2);
      height: $border-heigth;
      display: block;
      border-top-left-radius: $border-heigth;
      border-bottom-left-radius: $border-heigth;
    }
  }

  .range-knob {
    width: $knob-heigth;
    height: $knob-heigth;
    border-radius: 50%;
    background-color: rgb(0, 117, 255);
    position: absolute;
    top: 0;
    left: calc(#{$border-width} / 2);
    transform: translateX(-50%);
  }
}
</style>
