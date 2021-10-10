<template lang="pug">
  .ace(ref="aceEditor")
</template>

<script lang="ts">
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/mode-glsl'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-elastic_tabstops_lite'
import { Component, Ref, Vue } from 'nuxt-property-decorator'
@Component({})
export default class Ace extends Vue {
  @Ref() aceEditor!: HTMLDivElement
  editor!: ace.Ace.Editor
  gl: WebGLRenderingContext | null = null
  // mounted()
  mounted() {
    this.editor = ace.edit(this.aceEditor, {
      theme: 'ace/theme/monokai',
      mode: 'ace/mode/glsl',
      enableAutoIndent: true,
    })
    this.editor.setShowPrintMargin(false)
    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    })
  }

  // methods()
  setValue(value: string) {
    this.editor.setValue(value)
    this.editor.gotoLine(1, 0, true)
  }
}
</script>

<style lang="scss" scoped>
.ace {
  position: relative !important;
  width: 100%;
  height: 100%;
  margin: auto;
}
</style>
