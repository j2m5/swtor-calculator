<template>
  <GChart type="PieChart" :data="data" :options="options" />
</template>

<script>
import { GChart } from 'vue-google-charts/legacy'
export default {
  name: 'ThePie',
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
          height: 600,
          width: 600
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
