import store from '@/store'
import { transformStats } from '@/helpers/index'

export function calculateStats (item, action = 'add') {
  if (Object.keys(item).includes('statmodifiers')) {
    const data = prepareData(item)
    const user = Object.assign({}, store.state.user)
    for (const key in user) {
      data.forEach(el => {
        if (key === el[0]) {
          if (action === 'add') user[key] += el[1]
          if (action === 'sub') user[key] -= el[1]
        }
      })
    }
    return user
  }
  return store.state.user
}

function prepareData (item) {
  const result = []
  const statmodifiers = transformStats(item.statmodifiers)
  const data = statmodifiers.split(',')
  data.forEach(el => {
    result.push(el.split(':'))
    result.forEach(x => {
      x[1] = Number(x[1])
    })
  })
  return result
}
