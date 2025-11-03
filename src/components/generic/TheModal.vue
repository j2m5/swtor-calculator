<template>
  <vue-final-modal
    v-model="setVisible"
    :content-style="contentStyle"
    :click-to-close="false"
    classes="vfm-container"
    content-class="vfm-content">
    <slot name="header" />
    <slot name="main" />
    <slot name="footer" />
  </vue-final-modal>
</template>

<script>
export default {
  name: 'TheModal',
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    contentStyle: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      setVisible: false
    }
  },
  watch: {
    setVisible (val) {
      this.$emit('update:visible', val)
    },
    visible () {
      this.setVisible = this.visible
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/variables";
  .vfm-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vfm-content {
    background-color: #0c3a52;
    border: 1px solid #2893b7;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    padding: 1rem;
  }
</style>
