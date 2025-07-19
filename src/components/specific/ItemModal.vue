<template>
  <div ref="window" class="item-modal">
    <div class="modal-top">
      <span class="clickable" @click="closeItemModal">&times;</span>
    </div>
    <div class="modal-header">
      <item-popper
        v-if="isNotEmptyObject(modifiableItem)"
        :item="modifiableItem"
        :data-id="modifiableItem.id"
        reference-class="item"
        class="cell-content">
        <span class="item-name">{{ modifiableItem.name }}</span>
      </item-popper>
    </div>
    <div v-if="modifiableItem.hasOwnProperty('components')" class="modal-content">
      <div v-for="(el, key) in modifiableItem.components" :key="key" :class="el" class="list-items">
        <item-popper
          v-if="isNotEmptyObject(getComponent(el))"
          :item="getComponent(el)"
          :data-id="getComponent(el).id"
          reference-class="item"
          class="cell-content"
          @add-item="extract(getComponent(el))">
          <span class="item-name">{{ simplifyStats(getComponent(el)) }}</span>
        </item-popper>
        <div v-else class="cell"></div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemPopper from '@/components/specific/ItemPopper'
import getItem from '@/mixins/getItem'
import isNotEmptyObject from '@/mixins/isNotEmptyObject'
import openAndCloseModal from '@/mixins/openAndCloseModal'
import formatStats from '@/mixins/formatStats'
import { mapState } from 'vuex'
export default {
  name: 'ItemModal',
  components: { ItemPopper },
  mixins: [getItem, isNotEmptyObject, openAndCloseModal, formatStats],
  computed: mapState(['modifiableItem', 'bindings']),
  methods: {
    getComponent (category) {
      const binding = this.bindings.find(x => x.itemId === this.modifiableItem.id && x.category === category)
      if (typeof binding !== 'undefined') {
        return this.getItem(binding.modificationId)
      } else {
        return {}
      }
    },
    extract (item) {
      this.$store.dispatch('extractItem', item)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/variables";
  @import "../../styles/base";
  .item-modal {
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px solid #2893b7;
    border-radius: 5px;
    visibility: hidden;
    position: absolute;
    height: 350px;
    width: 300px;
    z-index: -999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    &.open {
      visibility: visible;
      z-index: 999;
    }
    .modal-top {
      background-color: #2893b7;
      border-radius: 5px 5px 0 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 20px;
      span {
        cursor: pointer;
        font-size: 22px;
        margin-right: 5px;
      }
    }
    .modal-header {
      padding: 3px 8px;
    }
    .modal-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      .list-items {
        border-bottom: 1px dotted #85827d;
        margin-bottom: 4px;
        height: 45px;
        width: 95%;
        .cell-content {
          .item {
            border-bottom: none !important;
          }
        }
        .cell {
          border: 1px solid #0c3a52;
          border-radius: 3px;
          margin: 3px;
          height: 35px;
          width: 35px;
        }
      }
    }
  }
</style>
