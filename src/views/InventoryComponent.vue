<template>
  <div class="inventory-main">
    <h3>Инвентарь</h3>
    <div class="inventory" ref="inventory">
      <div v-for="(slot, key) in inventory" :key="key" :data-slot="key" class="cell">
        <item-popper
          v-if="getItem(slot)"
          :item="getItem(slot)"
          :data-id="slot"
          reference-class="item-inventory"
          class="cell-content"
          draggable="true"
          @add-item="equipOrInsert(getItem(slot))"
          @modify-item="openItemModal"
          @delete-item="confirmDeletion($event)"
        />
      </div>
    </div>
    <div class="credits balance">{{ balance }}</div>
    <div class="helper-wrapper">
      <helper-popper />
    </div>
    <div class="firebase">
      <the-button btn-text="Сохранить билд" @btn-click="saveBuild" />
      <the-button btn-text="Загрузить билд" @btn-click="enterKeyModal = true" />
    </div>
    <confirm-modal
      :visible="confirmModal"
      action-text="Удалить предмет?"
      confirm-btn-text="Удалить"
      reject-btn-text="Отменить"
      @confirm="del(confirmData)"
      @reject="clearData"
    />
    <the-modal :visible="dataKeyModal">
      <template #header>
        <div>Запиши и не теряй этот ключ, с его помощью сохраненный билд может быть загружен</div>
      </template>
      <template #main>
        <the-text-input v-model="dataKey" />
      </template>
      <template #footer>
        <div class="flex-container flex-center-axis-x flex-center-axis-y">
          <the-button :btn-text="btnText" @btn-click="clipboardKey" />
          <the-button btn-text="Закрыть" @btn-click="closeDataKeyModal" />
        </div>
      </template>
    </the-modal>
    <the-modal :visible="enterKeyModal">
      <template #header>
        <div>Загрузить сохраненный билд по ключу</div>
      </template>
      <template #main>
        <the-text-input v-model="enterKey" placeholder="Введи ключ" />
      </template>
      <template #footer>
        <div class="flex-container flex-center-axis-x flex-center-axis-y">
          <the-button btn-text="Загрузить" @btn-click="loadBuild" />
          <the-button btn-text="Закрыть" @btn-click="closeEnterKeyModal" />
        </div>
      </template>
    </the-modal>
  </div>
</template>

<script>
import getItem from '@/mixins/getItem'
import openAndCloseModal from '@/mixins/openAndCloseModal'
import { mapState } from 'vuex'
import {
  isEquipable,
  isEquipped,
  isNotEmptyObject,
  isAlreadyBoundToItem,
  isAlreadyBusySlot,
  isNotAllowedItem
} from '@/helpers'
const ItemPopper = () => import('@/components/specific/ItemPopper')
const HelperPopper = () => import('@/components/specific/HelperPopper')
const ConfirmModal = () => import('@/components/specific/ConfirmModal')
const TheModal = () => import('@/components/generic/TheModal')
const TheButton = () => import('@/components/generic/TheButton')
const TheTextInput = () => import('@/components/generic/TheTextInput')
export default {
  name: 'InventoryComponent',
  components: {
    ItemPopper,
    HelperPopper,
    ConfirmModal,
    TheModal,
    TheButton,
    TheTextInput
  },
  mixins: [getItem, openAndCloseModal],
  data () {
    return {
      dataKeyModal: false,
      enterKeyModal: false,
      confirmModal: false,
      enterKey: '',
      dataKey: '',
      confirmData: {},
      btnText: 'Копировать ключ'
    }
  },
  computed: mapState(['inventory', 'balance', 'modifiableItem']),
  methods: {
    equipOrInsert (item) {
      if (isEquipable(item.category)) {
        if (isEquipped(item.category)) {
          this.$toast.warning('Предмет этого типа уже экипирован, снимите его чтобы одеть другой')
          return
        }
        this.$store.dispatch('equipItem', item)
      } else {
        if (isNotEmptyObject(this.modifiableItem)) {
          if (isNotAllowedItem(item.category)) {
            this.$toast.warning('Ты не можешь вставить модификацию этого типа в текущий предмет')
            return
          }
          if (isAlreadyBoundToItem(item)) {
            this.$toast.warning('Этот предмет уже привязан к экипировке')
            return
          }
          if (isAlreadyBusySlot(item.category)) {
            this.$toast.warning('Этот слот уже занят, вытащи текущий предмет чтобы вставить другой')
            return
          }
          this.$store.dispatch('insertItem', item)
        }
      }
    },
    confirmDeletion (item) {
      this.confirmModal = true
      this.confirmData = item
    },
    del (item) {
      this.$store.dispatch('deleteItem', item)
      this.$toast.success(`${item.name} удалено`)
      this.clearData()
    },
    clearData () {
      this.confirmModal = false
      this.confirmData = {}
    },
    clipboardKey () {
      navigator.clipboard.writeText(this.dataKey)
      this.btnText = 'Скопировано'
    },
    closeDataKeyModal () {
      this.dataKeyModal = false
      this.dataKey = ''
      this.btnText = 'Копировать ключ'
    },
    closeEnterKeyModal () {
      this.enterKeyModal = false
      this.enterKey = ''
    },
    saveBuild () {
      const data = Object.assign({}, this.$store.state)
      this.$store.dispatch('saveBuild', data).then(res => {
        const { key, message } = res
        this.dataKey = key
        this.dataKeyModal = true
        this.$toast.success(message)
      }).catch(err => {
        this.$toast.error(err.message)
      })
    },
    loadBuild () {
      if (!this.enterKey.length) {
        this.$toast.warning('Ключ не может быть пустым')
        return
      }
      this.$store.dispatch('loadBuild', this.enterKey).then(res => {
        this.closeEnterKeyModal()
        this.$toast.success(res)
      }).catch(err => {
        this.enterKey = ''
        this.$toast.error(err.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../styles/variables";
  @import "../styles/base";
  .inventory-main {
    h3 {
      text-align: center;
    }
    .inventory {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      width: 390px;
      .cell {
        border: 1px solid #0c3a52;
        border-radius: 3px;
        margin: 3px;
        height: 35px;
        width: 35px;
      }
    }
    .balance {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
    }
    .helper-wrapper, .firebase {
      display: flex;
      justify-content: center;
    }
  }
</style>
