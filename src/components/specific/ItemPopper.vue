<template>
  <popper trigger="hover" :append-to-body="true" :visible-arrow="false" :options="popperOptions">
    <div class="popper">
      <div class="popper-header">
        <img :src="require(`../../assets/${item.icon}`)" class="item-img" :class="item.quality" alt="">
        <div class="text-left">
          <div :class="`${item.quality}-text`" class="item-name"><b>{{ item.name }}</b></div>
          <div class="item-name"><b>Рейтинг {{ item.rating | getZeroRating }}</b></div>
        </div>
      </div>
      <div class="hr"></div>
      <div v-if="item.hasOwnProperty('statmodifiers') || hasModifications(item)">
        <div v-for="(stat, key) in formatStats(item)" :key="key" class="text-left">
          {{ stat.name }}: +{{ stat.value }}
        </div>
        <div class="hr"></div>
      </div>
      <div v-if="$store.state.bindings.filter(x => x.itemId === item.id).length"></div>
      <div v-if="item.hasOwnProperty('components')" class="text-left">
        <div v-for="(el, key) in item.components" :key="key">
          {{ el | upperCaseFirst }}:
          <span :class="`${findComponent(item.id, el).quality}-text`">
            {{ findComponent(item.id, el).name || 'Пустой слот' }}
          </span>
        </div>
      </div>
      <div class="hr"></div>
      <slot name="credits" />
    </div>
    <div
      slot="reference"
      :class="referenceClass"
      @click.right.prevent.exact="$emit('add-item')"
      @mouseup.ctrl.left.prevent.exact="$emit('modify-item', item)"
      @mouseup.alt.left.prevent.exact="$emit('delete-item', item)">
      <div
        class="item-img"
        :class="item.quality"
        :style="{ backgroundImage: `url(${require('../../assets/' + item.icon)})` }"
      />
      <slot name="name" />
    </div>
  </popper>
</template>

<script>
import Popper from 'vue-popperjs'
import 'vue-popperjs/dist/vue-popper.css'
import { getItem } from '@/helpers'
import hasModifications from '@/mixins/hasModifications'
import formatStats from '@/mixins/formatStats'
export default {
  name: 'ItemPopper',
  components: { popper: Popper },
  mixins: [hasModifications, formatStats],
  filters: {
    upperCaseFirst (str) {
      return str.charAt(0).toLocaleUpperCase() + str.slice(1)
    },
    getZeroRating (rating) {
      return (!rating) ? 'не определен' : rating
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    placement: {
      type: String,
      default: () => 'bottom'
    },
    referenceClass: {
      type: String,
      default: () => 'item'
    }
  },
  data () {
    return {
      popperOptions: {
        placement: this.placement,
        modifiers: {
          offset: {
            offset: '0,20px'
          }
        }
      }
    }
  },
  methods: {
    findComponent (id, category) {
      const bindings = this.$store.state.bindings.filter(x => x.itemId === this.item.id)
      const component = bindings.find(x => x.category === category) || {}
      return getItem(component.modificationId) || {}
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/variables";
  @import "../../styles/base";
  .popper {
    .popper-header {
      display: flex;
      align-items: center;
    }
  }
</style>
