import Vue from 'vue'
import Vuex from 'vuex'
import {
  getBuffValue as buff,
  activateOrDeactivateBuff,
  getRandomVendorComment,
  isEquipable,
  getItem,
  hasModifications,
  isEquippedItem
} from '@/helpers'
import {
  calculatePercentFromRating as calc,
  calculateEnergyRegen as calcRegen,
  calculateBonusDamageOrHealing as calcBonus,
  calculateHealth
} from '@/helpers/formulas'
import { calculateStats } from '@/helpers/calculations'
import { create, read } from '@/database'
import modifiers from '@/data/math'
import classBuffs from '@/data/classBuffs'
import companionBuffs from '@/data/companionBuffs'
import datacrons from '@/data/datacrons'
import stims from '@/data/stims'
import guildBuffs from '@/data/guildBuffs'
import disciplineBuffs from '@/data/disciplineBuffs'

Vue.use(Vuex)

const rows = 12
const cols = 9
const numberSlots = rows * cols

const basePercents = {
  accuracy: {
    white: 0,
    yellow: 100
  },
  alacrity: 0,
  shield: 5,
  absorb: 20,
  defense: 5,
  criticalChance: 5,
  criticalMultiplier: 50
}

const baseValues = {
  mastery: 1150,
  endurance: 1035,
  health: 105095,
  energyRegen: 5
}

const bonusDamageOrHealing = {
  damage: {
    mastery: 0.2,
    power: 0.23
  },
  healing: {
    mastery: 0.14,
    power: 0.17
  }
}

const store = new Vuex.Store({
  state: {
    inventory: Array(numberSlots).fill('empty'),
    ownedItems: [],
    modifiableItem: {},
    bindings: [],
    equipment: [],
    vendorComment: null,
    balance: 2500000000,
    user: {
      mastery: 1150,
      endurance: 1035,
      power: 0,
      ftPower: 0,
      accuracy: 0,
      alacrity: 0,
      critical: 0,
      shield: 0,
      absorb: 0,
      defense: 0
    },
    datacrons,
    companionBuffs,
    classBuffs,
    stims,
    guildBuffs,
    disciplineBuffs
  },
  getters: {
    buffedMastery (state) {
      const datacron = buff(datacrons.find(x => x.attribute === 'mastery'))
      const stim = buff(stims.find(x => x.attribute === 'mastery')).mastery || 0
      return state.user.mastery + datacron + stim
    },
    buffedEndurance (state) {
      const datacron = buff(datacrons.find(x => x.attribute === 'endurance'))
      const stim = buff(stims.find(x => x.attribute === 'endurance')).endurance || 0
      return state.user.endurance + datacron + stim
    },
    buffedAccuracy (state) {
      const stim = buff(stims.find(x => x.attribute === 'accuracy')).accuracy || 0
      return state.user.accuracy + stim
    },
    buffedCritical (state) {
      const stim = buff(stims.find(x => x.attribute === 'accuracy')).critical || 0
      return state.user.critical + stim
    },
    buffedDefense (state) {
      const stim = buff(stims.find(x => x.attribute === 'endurance')).defense || 0
      return state.user.defense + stim
    },
    buffedPower (state) {
      const stim = buff(stims.find(x => x.attribute === 'mastery')).power || 0
      return state.user.power + stim
    },
    alacrityPercent (state) {
      const alacrity = modifiers.find(x => x.attribute === 'alacrity')
      const discipline = buff(disciplineBuffs.find(x => x.attribute === 'alacrity')) * 100
      const guild = buff(guildBuffs.find(x => x.attribute === 'alacrity')) * 100
      return basePercents.alacrity + calc(state.user.alacrity, alacrity.cap, alacrity.divisor) + discipline + guild
    },
    accuracyWhitePercent (state, getters) {
      const accuracy = modifiers.find(x => x.attribute === 'accuracy')
      const companionBuff = buff(companionBuffs.find(x => x.attribute === 'meleeTank')) * 100
      const discipline = buff(disciplineBuffs.find(x => x.attribute === 'accuracy')) * 100
      return basePercents.accuracy.white + calc(getters.buffedAccuracy, accuracy.cap, accuracy.divisor) + companionBuff + discipline
    },
    accuracyYellowPercent (state, getters) {
      const accuracy = modifiers.find(x => x.attribute === 'accuracy')
      const companionBuff = buff(companionBuffs.find(x => x.attribute === 'meleeTank')) * 100
      const discipline = buff(disciplineBuffs.find(x => x.attribute === 'accuracy')) * 100
      return basePercents.accuracy.yellow + calc(getters.buffedAccuracy, accuracy.cap, accuracy.divisor) + companionBuff + discipline
    },
    criticalChancePercent (state, getters) {
      const mastery = modifiers.find(x => x.attribute === 'mastery')
      const critical = modifiers.find(x => x.attribute === 'critical')
      const fromMastery = calc(getters.buffedMastery, mastery.cap, mastery.divisor)
      const fromCritical = calc(getters.buffedCritical, critical.cap, critical.divisor)
      const companionBuff = buff(companionBuffs.find(x => x.attribute === 'rangedDps')) * 100
      const classBuff = buff(classBuffs.find(x => x.attribute === 'critical')) * 100
      const guildBuff = buff(guildBuffs.find(x => x.attribute === 'critical')) * 100
      return basePercents.criticalChance + fromMastery + fromCritical + companionBuff + classBuff + guildBuff
    },
    criticalMultiplierPercent (state) {
      const critical = modifiers.find(x => x.attribute === 'critical')
      const companionBuff = buff(companionBuffs.find(x => x.attribute === 'meleeDps')) * 100
      return basePercents.criticalMultiplier + calc(state.user.critical, critical.cap, critical.divisor) + companionBuff
    },
    defensePercent (state) {
      const defense = modifiers.find(x => x.attribute === 'defense')
      return basePercents.defense + calc(state.user.defense, defense.cap, defense.divisor)
    },
    shieldPercent (state) {
      const shield = modifiers.find(x => x.attribute === 'shield')
      return basePercents.shield + calc(state.user.shield, shield.cap, shield.divisor)
    },
    absorbPercent (state) {
      const absorb = modifiers.find(x => x.attribute === 'absorb')
      return basePercents.absorb + calc(state.user.absorb, absorb.cap, absorb.divisor)
    },
    energyRegen (state, getters) {
      return calcRegen(baseValues.energyRegen, getters.alacrityPercent)
    },
    health (state, getters) {
      const x = buff(classBuffs.find(x => x.attribute === 'endurance'))
      const y = buff(companionBuffs.find(x => x.attribute === 'rangedTank'))
      const result = calculateHealth(baseValues.health, getters.buffedEndurance, x, y)
      return Math.ceil(result)
    },
    bonusDamageWhite (state, getters) {
      const x = buff(classBuffs.find(x => x.attribute === 'mastery'))
      const y = 0
      const z = buff(classBuffs.find(x => x.attribute === 'power'))
      const result = calcBonus(getters.buffedMastery, state.user.power, bonusDamageOrHealing.damage.mastery, bonusDamageOrHealing.damage.power, x, y, z)
      return Math.ceil(result)
    },
    bonusDamageYellow (state, getters) {
      const x = buff(classBuffs.find(x => x.attribute === 'mastery'))
      const y = 0
      const z = buff(classBuffs.find(x => x.attribute === 'power'))
      const result = calcBonus(getters.buffedMastery, state.user.power + state.user.ftPower, bonusDamageOrHealing.damage.mastery, bonusDamageOrHealing.damage.power, x, y, z)
      return Math.ceil(result)
    },
    bonusHealing (state, getters) {
      const x = buff(classBuffs.find(x => x.attribute === 'mastery'))
      const y = 0
      const z = buff(classBuffs.find(x => x.attribute === 'power'))
      const result = calcBonus(getters.buffedMastery, state.user.power + state.user.ftPower, bonusDamageOrHealing.healing.mastery, bonusDamageOrHealing.healing.power, x, y, z)
      return Math.ceil(result)
    }
  },
  mutations: {
    updateState (state, payload) {
      for (const payloadKey in payload) {
        for (const stateKey in state) {
          if (payloadKey === stateKey) {
            state[stateKey] = payload[payloadKey]
          }
        }
      }
    },
    updateSlot (state, payload) {
      const index = state.inventory.findIndex(x => x === 'empty')
      state.inventory.splice(index, 1, payload.id)
    },
    clearSlot (state, payload) {
      const index = state.inventory.findIndex(x => x === payload.id)
      state.inventory.splice(index, 1, 'empty')
    },
    addItem (state, payload) {
      state.ownedItems.push(payload)
    },
    deleteItem (state, payload) {
      state.ownedItems.splice(payload, 1)
    },
    bindItem (state, payload) {
      state.bindings.push(payload)
    },
    unbindItem (state, payload) {
      state.bindings.splice(payload, 1)
    },
    moveItem (state, payload) {
      const { oldIndex, newIndex } = payload
      state.inventory.splice(newIndex, 0, state.inventory.splice(oldIndex, 1)[0])
    },
    updateOwnedItems (state, payload) {
      state.ownedItems = payload
    },
    updateModifiableItem (state, payload) {
      state.modifiableItem = payload
    },
    updateEquipment (state, payload) {
      const [item, action] = payload
      if (action === 'equip') {
        state.equipment.splice(state.equipment.length, 0, item)
      }
      if (action === 'drop') {
        const index = state.equipment.findIndex(x => x.id === item.id)
        state.equipment.splice(index, 1)
      }
    },
    updateVendorComment (state, payload) {
      state.vendorComment = payload
    },
    calculateBalance (state, payload) {
      state.balance -= payload
    },
    updateUser (state, payload) {
      state.user = payload
    },
    activateOrDeactivateDatacronBuff (state, payload) {
      const index = state.datacrons.findIndex(x => x.attribute === payload.attribute)
      activateOrDeactivateBuff(payload, state.datacrons, index)
    },
    activateOrDeactivateCompanionBuff (state, payload) {
      const index = state.companionBuffs.findIndex(x => x.attribute === payload.attribute)
      activateOrDeactivateBuff(payload, state.companionBuffs, index)
    },
    activateOrDeactivateClassBuff (state, payload) {
      const index = state.classBuffs.findIndex(x => x.attribute === payload.attribute)
      activateOrDeactivateBuff(payload, state.classBuffs, index)
    },
    activateOrDeactivateStim (state, payload) {
      const index = state.stims.findIndex(x => x.attribute === payload.attribute)
      activateOrDeactivateBuff(payload, state.stims, index)
    },
    activateOrDeactivateGuildBuff (state, payload) {
      const index = state.guildBuffs.findIndex(x => x.attribute === payload.attribute)
      activateOrDeactivateBuff(payload, state.guildBuffs, index)
    },
    activateOrDeactivateDisciplineBuff (state, payload) {
      const index = state.disciplineBuffs.findIndex(x => x.attribute === payload.attribute)
      activateOrDeactivateBuff(payload, state.disciplineBuffs, index)
    }
  },
  actions: {
    buyItem ({ commit }, payload) {
      const newItem = Object.assign({}, payload)
      newItem.id = new Date().getTime()
      commit('addItem', newItem)
      commit('updateSlot', newItem)
      commit('calculateBalance', newItem.price)
      getRandomVendorComment('onBuy')
    },
    equipItem ({ commit, state }, payload) {
      commit('updateEquipment', [payload, 'equip'])
      if (isEquipable(payload.category)) {
        const bindings = state.bindings.filter(x => x.itemId === payload.id)
        bindings.forEach(el => {
          const item = getItem(el.modificationId)
          const user = calculateStats(item, 'add')
          commit('updateUser', user)
        })
      }
      const user = calculateStats(payload, 'add')
      commit('updateUser', user)
      commit('clearSlot', payload)
    },
    dropItem ({ commit, state }, payload) {
      commit('updateSlot', payload)
      if (isEquipable(payload.category)) {
        const bindings = state.bindings.filter(x => x.itemId === payload.id)
        bindings.forEach(el => {
          const item = getItem(el.modificationId)
          const user = calculateStats(item, 'sub')
          commit('updateUser', user)
        })
      }
      const user = calculateStats(payload, 'sub')
      commit('updateUser', user)
      commit('updateEquipment', [payload, 'drop'])
    },
    insertItem ({ commit, state }, payload) {
      const binding = {
        itemId: state.modifiableItem.id,
        category: payload.category,
        modificationId: payload.id
      }
      commit('bindItem', binding)
      if (isEquippedItem(getItem(state.modifiableItem.id))) {
        const user = calculateStats(payload, 'add')
        commit('updateUser', user)
      }
      commit('clearSlot', payload)
    },
    extractItem ({ commit, state }, payload) {
      commit('updateSlot', payload)
      const index = state.bindings.findIndex(x => x.itemId === state.modifiableItem.id && x.modificationId === payload.id)
      if (isEquippedItem(getItem(state.modifiableItem.id))) {
        const user = calculateStats(payload, 'sub')
        commit('updateUser', user)
      }
      commit('unbindItem', index)
    },
    deleteItem ({ commit, state }, payload) {
      if (hasModifications(payload)) {
        const bindings = state.bindings.filter(x => x.itemId === payload.id).map(x => x.modificationId)
        bindings.forEach(el => {
          const index1 = state.bindings.findIndex(x => x.modificationId === el)
          const index2 = state.ownedItems.findIndex(x => x.id === el)
          commit('unbindItem', index1)
          commit('deleteItem', index2)
        })
      }
      const index = state.ownedItems.findIndex(x => x.id === payload.id)
      state.ownedItems.splice(index, 1)
      commit('clearSlot', payload)
    },
    saveBuild ({ commit }, payload) {
      return create(payload, 'builds').then(res => {
        if (!Object.keys(res).includes('error')) {
          return { key: res.name, message: 'Билд успешно сохранен' }
        } else {
          throw new Error(res.error)
        }
      })
    },
    loadBuild ({ commit }, payload) {
      return read(payload, 'builds').then(res => {
        if (res) {
          commit('updateState', res)
          return 'Билд успешно загружен'
        } else {
          throw new Error('Не удалось загрузить билд, проверь правильность ключа')
        }
      })
    }
  }
})

export default store
