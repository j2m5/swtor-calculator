<template>
  <div class="dashboard">
    <the-navigation />
    <div class="charts">
      <div>
        <div>Соотношение статов (без учета баффов)</div>
        <div class="flex-container flex-center-axis-x flex-center-axis-y">
          <the-pie :data="datasetForPieChart" />
        </div>
      </div>
      <div>
        <div>Соотношение третичных статов в одетых предметах</div>
        <div class="flex-container flex-center-axis-x flex-center-axis-y">
          <the-column :data="datasetForColumnChart" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import statAliases from '@/data/statAliases'
import { getTertiaryStatsOfItem } from '@/helpers'
const TheNavigation = () => import('@/components/generic/TheNavigation')
const ThePie = () => import('@/components/generic/ThePie')
const TheColumn = () => import('@/components/generic/TheColumn')
export default {
  name: 'DashboardComponent',
  components: { TheNavigation, ThePie, TheColumn },
  data () {
    return {
      statAliases,
      dataset: [
        ['Piece', 'Accuracy', 'Alacrity', 'Critical', 'Shield', 'Absorb'],
        ['Нет данных', 0, 0, 0, 0, 0]
      ]
    }
  },
  computed: {
    datasetForPieChart () {
      const matrix = []
      for (const key in this.$store.state.user) {
        for (const stat of statAliases) {
          if (key === stat.alias) {
            matrix.push([this.transformRating(stat.name), this.$store.state.user[key]])
          }
        }
      }
      matrix.unshift(['Количество', 'Рейтинг'])
      return matrix
    },
    datasetForColumnChart () {
      const tertiary = statAliases.filter(x => x.type === 'tertiary').map(x => x.alias)
      const matrix = []
      for (const item of this.$store.state.equipment) {
        matrix.push(getTertiaryStatsOfItem(item))
      }
      matrix.unshift([
        'Piece',
        ...statAliases.filter(x => tertiary.some(y => x.alias.includes(y))).map(x => this.transformRating(x.name))
      ])
      if (matrix.length > 1) return matrix
      else return this.dataset
    }
  },
  methods: {
    transformRating (str) {
      return str.replaceAll('Rating', '')
        .replaceAll('Absorption', 'Absorb')
        .trim()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../styles/variables";
  @import "../styles/base";
  .dashboard {
    .charts {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin: 20px 0 0;
      width: 100%;
    }
  }
</style>
