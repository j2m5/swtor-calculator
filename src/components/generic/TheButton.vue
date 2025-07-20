<template>
  <button :type="btnType" :class="[...classes]" @click="$emit('btn-click')">
    <slot name="icon" /> {{ btnText }}
  </button>
</template>

<script>
export default {
  name: 'TheButton',
  props: {
    btnType: {
      type: String,
      default: () => 'button'
    },
    btnText: {
      type: String,
      default: () => 'ОК'
    },
    classes: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./src/styles/variables";
  button {
    background-color: #0c3a52;
    border: 1px solid #2893b7;
    border-radius: 15px;
    color: $lightGray;
    cursor: pointer;
    font-family: 'Open Sans', Arial, Helvetica, Avenir, sans-serif;
    outline: none;
    margin: 0 5px;
    padding: 5px 10px;
    &:hover {
      background-color: #2893b7;
    }
  }
</style>
