<template>
  <div class="vendor">
    <div v-if="showAlfe" class="vendor-container">
      <div class="vendor-data">
        <div class="vendor-avatar">
          <img src="../assets/alfe.png" alt="">
        </div>
        <div class="vendor-name">
          <div>Alfe</div>
          <div class="fz-14">&lt;Gear vendor&gt;</div>
        </div>
      </div>
      <div class="vendor-comment">&laquo;{{ $store.state.vendorComment }}&raquo;</div>
    </div>
    <div class="filters">
      <div
        class="clear-filter"
        title="Очистить фильтр"
        :style="{ backgroundImage: `url(${require('../assets/clear.png')})` }"
        @click="clearFilter"
      />
      <tags-input
        v-model="tags"
        :existing-tags="existingTags"
        :only-existing-tags="true"
        :typeahead="true"
        :typeahead-always-show="true"
        :typeahead-hide-discard="true"
        placeholder="Поиск"
        @tag-added="prepareFilter"
        @tag-removed="updateFilter"
      />
    </div>
    <scrolly class="scrollbar" :parentScroll="false" :style="{ width: '270px', height: showAlfe ? '430px' : '505px' }">
      <scrolly-viewport>
        <div class="list-items" v-for="(item, key) in filteredItems" :key="key">
          <item-popper :item="item" placement="right" @add-item="buy(item)">
            <template #credits>
              <div class="text-left credits">{{ item.price }}</div>
            </template>
            <template #name>
              <span class="item-name">{{ item.name }}</span>
            </template>
          </item-popper>
        </div>
      </scrolly-viewport>
      <scrolly-bar axis="y" />
    </scrolly>
  </div>
</template>

<script>
import equipment from '@/data/equipment'
import vendorComments from '@/data/vendorComments'
import { getRandomVendorComment, multiFilter } from '@/helpers'
import '@voerro/vue-tagsinput/dist/style.css'
import { Scrolly, ScrollyViewport, ScrollyBar } from 'vue-scrolly'
const ItemPopper = () => import('@/components/specific/ItemPopper')
const VoerroTagsInput = () => import('@voerro/vue-tagsinput')
export default {
  name: 'VendorComponent',
  components: { ItemPopper, Scrolly, ScrollyViewport, ScrollyBar, 'tags-input': VoerroTagsInput },
  filters: {
    sliceStr (str, count = 100) {
      let sliced = str.slice(0, count)
      if (sliced.length < str.length) {
        sliced += '...'
      }
      return sliced
    }
  },
  data () {
    return {
      tags: [],
      existingTags: [
        { key: 'helmet', value: 'Helmet', prop: 'category' },
        { key: 'wrist', value: 'Wrist', prop: 'category' },
        { key: 'chest', value: 'Chest', prop: 'category' },
        { key: 'gloves', value: 'Gloves', prop: 'category' },
        { key: 'boots', value: 'Boots', prop: 'category' },
        { key: 'waist', value: 'Waist', prop: 'category' },
        { key: 'legs', value: 'Legs', prop: 'category' },
        { key: 'mainhand', value: 'Mainhand', prop: 'category' },
        { key: 'offhand', value: 'Offhand', prop: 'category' },
        { key: 'ear', value: 'Ear', prop: 'category' },
        { key: 'implant', value: 'Implant', prop: 'category' },
        { key: 'relic', value: 'Relic', prop: 'category' },
        { key: 'armoring', value: 'Armoring', prop: 'category' },
        { key: 'weapon', value: 'Weapon', prop: 'category' },
        { key: 'mod', value: 'Mod', prop: 'category' },
        { key: 'enhancement', value: 'Enhancement', prop: 'category' },
        { key: 'augment', value: 'Augment', prop: 'category' },
        { key: 'crystal', value: 'Crystal', prop: 'category' },
        { key: '340', value: '340', prop: 'rating' },
        { key: '344', value: '344', prop: 'rating' },
        { key: 'prototype', value: 'Prototype', prop: 'quality' },
        { key: 'artifact', value: 'Artifact', prop: 'quality' },
        { key: 'legendary', value: 'Legendary', prop: 'quality' }
      ],
      query: {
        category: [],
        rating: [],
        quality: []
      },
      showAlfe: true,
      equipment,
      vendorComments
    }
  },
  computed: {
    filteredItems () {
      if (this.query.category.length || this.query.rating.length || this.query.quality.length) {
        return multiFilter(this.equipment, this.query)
      } else {
        return this.equipment
      }
    }
  },
  created () {
    getRandomVendorComment('onLoad')
  },
  methods: {
    buy (item) {
      if (this.$store.state.ownedItems.length === this.$store.state.inventory.length) {
        this.$toast.warning('Не хватает места в инвентаре')
        return
      }
      this.$store.dispatch('buyItem', item)
      this.$toast.success(`${item.name} успешно добавлен в инвентарь`)
    },
    prepareFilter (tag) {
      this.query[tag.prop].push(tag.key)
    },
    updateFilter (tag) {
      const index = this.query[tag.prop].indexOf(tag.key)
      this.query[tag.prop].splice(index, 1)
    },
    clearFilter () {
      this.query.category = []
      this.query.rating = []
      this.query.quality = []
      this.tags = []
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../styles/variables";
  @import "../styles/base";
  .vendor {
    display: flex;
    flex-direction: column;
    padding: 4px;
    width: 280px;
    .vendor-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 10px;
      height: 125px;
      .vendor-data {
        display: flex;
        align-items: center;
        .vendor-avatar {
          border-radius: 50%;
          display: flex;
          height: 40px;
          width: 40px;
          overflow: hidden;
          margin-right: 5px;
        }
        .vendor-name {
          color: $yellow;
          text-align: center;
        }
      }
    }
    .filters {
      margin: 0 0 5px;
      position: relative;
      .clear-filter {
        background-repeat: no-repeat;
        background-size: contain;
        cursor: pointer;
        height: 35px;
        width: 35px;
        position: absolute;
        right: 5px;
        z-index: 1000;
        transform: scale(0.7);
      }
    }
    .vendor-comment {
      color: #d4d1cb;
      display: flex;
      align-items: center;
      font-style: italic;
      font-size: 12px;
      margin-top: 5px;
      padding-bottom: 5px;
    }
    .scrollbar {
      border-top: 1px dotted #85827d;
    }
    .list-items {
      height: 50px;
    }
  }
</style>

<style lang="scss">
  .tags-input-wrapper-default {
    background: #0c3a52;
    border: 1px solid #2893b7;
    width: 230px;
    input[type="text"] {
      color: #d4d1cb;
    }
    .tags-input-badge-selected-default {
      color: #d4d1cb;
      background-color: #052534;
    }
  }
  .typeahead-badges {
    margin: 0;
  }
</style>
