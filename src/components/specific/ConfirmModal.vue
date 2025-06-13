<template>
  <vue-final-modal
    v-model="setVisible"
    :click-to-close="false"
    classes="vfm-container"
    content-class="vfm-content">
    <div class="vfm-header">
      <div>{{ actionText }}</div>
    </div>
    <div class="vfm-main"></div>
    <div class="vfm-footer">
      <the-button :btn-text="confirmBtnText" @btn-click="$emit('confirm')" />
      <the-button :btn-text="rejectBtnText" @btn-click="$emit('reject')" />
    </div>
  </vue-final-modal>
</template>

<script>
import TheButton from '@/components/generic/TheButton'
export default {
  name: 'ConfirmModal',
  components: { TheButton },
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    actionText: {
      type: String,
      default: () => ''
    },
    confirmBtnText: {
      type: String,
      default: () => 'Да'
    },
    rejectBtnText: {
      type: String,
      default: () => 'Нет'
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

<style lang="scss">
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
    width: 300px;
  }
  .vfm-header {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
  }
  .vfm-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    padding: 1rem 0 0;
  }
</style>
