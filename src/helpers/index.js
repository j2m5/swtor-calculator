import store from '@/store'
import vendorComments from '@/data/vendorComments'
import equipmentLimits from '@/data/equipmentLimits'
import statAliases from '@/data/statAliases'

export function getRandomVendorComment (type) {
  const comment = type === 'onLoad' ? vendorComments.onLoad : vendorComments.onBuy
  const rand = Math.floor(Math.random() * comment.length)
  store.commit('updateVendorComment', comment[rand])
}

export function getItem (id) {
  return store.state.ownedItems.find(x => x.id === id)
}

export function getBindings (item) {
  return store.state.bindings.filter(x => x.itemId === item.id)
}

export function getBuffValue (buff) {
  if (buff.active) {
    return buff.value
  }

  return 0
}

export function activateOrDeactivateBuff (buff, list, index) {
  if (buff.active) {
    buff.active = false
    list.splice(index, 1, buff)
  } else {
    buff.active = true
    list.splice(index, 1, buff)
  }
}

export function isEquipable (category) {
  const allowedTypes = equipmentLimits.map(x => x.category)

  return allowedTypes.includes(category)
}

export function isEquipped (category) {
  const data = equipmentLimits.find(x => x.category === category)
  const equipped = store.state.equipment.filter(x => x.category === category)

  return equipped.length >= data.limit
}

export function isEquippedItem (item) {
  const equippedItems = store.state.equipment.map(x => x.id)

  return equippedItems.includes(item.id)
}

export function checkAvailableModifications (array, type) {
  return array.includes(type)
}

export function isNotEmptyObject (obj) {
  return !!Object.keys(obj).length
}

export function isAlreadyBoundToItem (item) {
  const ids = store.state.bindings.map(x => x.modificationId)

  return ids.includes(item.id)
}

export function isAlreadyBusySlot (category) {
  const busySlots = store.state.bindings.filter(x => x.itemId === store.state.modifiableItem.id).map(x => x.category)

  return busySlots.includes(category)
}

export function isNotAllowedItem (category) {
  const allowedSlots = store.state.modifiableItem.components

  return !allowedSlots.includes(category)
}

export function hasModifications (item) {
  return store.state.bindings.filter(x => x.itemId === item.id).length > 0
}

export function getTertiaryStatsOfItem (item) {
  const tertiary = statAliases.filter(x => x.type === 'tertiary').map(x => x.alias)
  const data = formatStats(item).filter(x => tertiary.some(y => x.alias.includes(y)))
  if (data.length) {
    const map = data.map(x => x.alias)
    for (const key of tertiary) {
      for (const item of data) {
        if (!map.includes(key)) {
          const fakeItem = { id: null, alias: key, name: statAliases.find(x => x.alias === key).name, category: item.category, value: 0 }
          data.push(fakeItem)
          break
        }
      }
    }
    data.sort((x, y) => tertiary.indexOf(x.alias) - tertiary.indexOf(y.alias))
    const result = data.map(x => x.value)
    result.unshift(item.category)

    return result
  } else {
    const empty = Array(tertiary.length).fill(0)
    empty.unshift(item.category)

    return empty
  }
}

export function simplifyStats (item) {
  const array = item.statmodifiers.split(',')
  let numbers = ''
  array.forEach(el => {
    const tmp = el.split(':')[1].trim()
    numbers += ` +${tmp}`
  })

  return numbers
}

export function formatStats (item) {
  const stats = statAliases.map(x => x.alias)

  const rawData = []
  if (Object.keys(item).includes('statmodifiers')) {
    rawData.push(item.statmodifiers.split(','))
  }

  if (hasModifications(item)) {
    const bindings = getBindings(item)
    bindings.forEach(el => {
      const component = getItem(el.modificationId)
      rawData.push(component.statmodifiers.split(','))
    })
  }

  const result = []
  rawData.forEach(el => {
    el.forEach(x => {
      const [name, value] = x.split(':')
      const alias = statAliases.find(x => x.name === name.trim()).alias
      result.push({ alias, name: name.trim(), value: Number(value) })
    })
  })

  const group = result.reduce((group, stat) => {
    const { alias } = stat
    group[alias] = group[alias] ?? []
    group[alias].push(stat)

    return group
  }, {})

  const calculated = []
  for (const key in group) {
    calculated.push({
      id: item.id,
      alias: key,
      name: statAliases.find(x => x.alias === key).name,
      value: group[key].map(x => x.value).reduce((acc, val) => acc + val, 0),
      category: item.category
    })
  }

  calculated.sort((x, y) => stats.indexOf(x.alias) - stats.indexOf(y.alias))

  return calculated
}

export function transformStats (str) {
  return str.toLowerCase()
    .replaceAll('rating', '')
    .replaceAll('absorption', 'absorb')
    .replaceAll('forcetech power', 'ftPower')
    .replaceAll(/\s/g, '')
}

export function multiFilter (array, filters) {
  const filterKeys = Object.keys(filters)
  return array.filter(item => {
    return filterKeys.every(key => {
      if (!filters[key].length) return true

      return filters[key].find(filter => getValue(filter) === getValue(item[key]))
    })
  })
}

function getValue (value) {
  if (typeof value === 'string') value = value.toUpperCase()
  if (!isNaN(value)) value = Number(value)

  return value
}
