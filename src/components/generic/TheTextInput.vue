<template>
  <input
    :value="value"
    :type="inputType"
    :placeholder="placeholder"
    :class="[...classes]"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script>
export default {
  name: 'TheTextInput',
  props: {
    inputType: {
      type: String,
      default: () => 'text'
    },
    value: {
      type: String,
      default: () => ''
    },
    placeholder: {
      type: String,
      default: () => ''
    },
    classes: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
  input {
    background: #0c3a52;
    border: 1px solid #2893b7;
    border-radius: 15px;
    color: #d4d1cb;
    outline: none;
    margin: 5px 0;
    padding: 5px;
  }
</style>
