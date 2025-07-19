<template>
  <popper trigger="hover" :append-to-body="true" :visible-arrow="false" :options="popperOptions">
    <div class="popper" style="width: 300px;">
      <div class="flex-container flex-center-axis-y">
        <img :src="require(`../../assets/${data.icon}`)" class="item-img legendary" alt="">
        <div class="text-left">
          <div class="item-name"><b>{{ data.name }}</b></div>
        </div>
      </div>
      <div class="description text-left">{{ data.description }}</div>
    </div>
    <div slot="reference" class="item-inventory ability clickable" :class="{ active: data.active }" @click="$emit('activate', data)">
      <div
        class="item-img legendary"
        :style="{ backgroundImage: `url(${require('../../assets/' + data.icon)})` }"
      />
      <slot />
    </div>
  </popper>
</template>

<script>
import Popper from 'vue-popperjs'
import 'vue-popperjs/dist/vue-popper.css'
export default {
  name: 'AbilityPopper',
  components: { popper: Popper },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      popperOptions: {
        placement: 'bottom',
        modifiers: {
          offset: {
            offset: '0,20px'
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/variables";
  @import "../../styles/base";
  .description {
    margin-top: 5px;
  }
  .ability {
    margin: 0 5px;
    opacity: 0.5;
  }
  .active {
    opacity: 1;
  }
</style>
