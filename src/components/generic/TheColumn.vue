<template>
  <GChart type="ColumnChart" :data="data" :options="options" />
</template>

<script>
import { GChart } from 'vue-google-charts/legacy'
export default {
  name: 'TheColumn',
  components: { GChart },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      options: {
        height: 680,
        width: 720,
        backgroundColor: 'transparent',
        chartArea: {
          left: 40,
          height: 450,
          width: 550
        },
        hAxis: {
          baselineColor: '#d4d1cb',
          gridlines: {
            color: '#d4d1cb'
          },
          minorGridlines: {
            color: '#d4d1cb'
          },
          textStyle: {
            color: '#d4d1cb'
          }
        },
        vAxis: {
          gridlines: {
            color: '#d4d1cb'
          },
          textStyle: {
            color: '#d4d1cb'
          }
        },
        legend: {
          alignment: 'center',
          textStyle: {
            color: '#d4d1cb'
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
