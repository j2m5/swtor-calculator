<template>
  <div class="ev-wrapper">
    <div class="preview">
      <div class="matrix">
        <div v-for="(item, index) in matrix" :key="index" class="matrix-item">
          <template v-if="index === 2">
            <img :src="require('../../assets/ev-green.png')" alt="">
          </template>
          <template v-if="index === 5">
            <img :src="require('../../assets/ev-blue.png')" alt="">
          </template>
          <template v-if="index === 9">
            <img :src="require('../../assets/ev-red.png')" alt="">
          </template>
          <template v-if="index === 15">
            <img :src="require('../../assets/ev-yellow.png')" alt="">
          </template>
          <template v-if="index === 19">
            <img :src="require('../../assets/ev-purple.png')" alt="">
          </template>
          <template v-if="index === 22">
            <img :src="require('../../assets/ev-white.png')" alt="">
          </template>
        </div>
      </div>
    </div>
    <div class="pylon">
      <div class="pylon-columns">
        <div class="pylon-col">
          <div v-for="(color, key) in pylon.firstCol" :key="key + 10">
            <img :src="require(`../../assets/${getColorImageName(color)}`)" alt="">
          </div>
        </div>
        <div class="pylon-col">
          <div v-for="(color, key) in pylon.secondCol" :key="key + 20">
            <img :src="require(`../../assets/${getColorImageName(color)}`)" alt="">
          </div>
        </div>
        <div class="pylon-col">
          <div v-for="(color, key) in pylon.thirdCol" :key="key + 30">
            <img :src="require(`../../assets/${getColorImageName(color)}`)" alt="">
          </div>
        </div>
      </div>
      <div class="pylon-buttons">
        <div class="row">
          <the-button btn-text="Влево" @btn-click="rotate('left')" />
          <the-button btn-text="Фиксация" @btn-click="commit" />
          <the-button btn-text="Вправо" @btn-click="rotate('right')" />
        </div>
        <div class="row">
          <the-button btn-text="Сбросить" @btn-click="reset" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const TheButton = () => import('@/components/generic/TheButton')
export default {
  name: 'EternityVault',
  components: { TheButton },
  data () {
    return {
      pylon: {},
      matrix: Array(25).fill(null),
      colors: ['white', 'yellow', 'blue', 'green', 'red', 'purple'],
      commits: [false, false, false, false],
      currentRow: 3
    }
  },
  created () {
    this.setPylon()
  },
  methods: {
    rotate (to) {
      const allowedDirections = ['left', 'right']

      if (!allowedDirections.includes(to)) return

      const current = this.colors.indexOf(this.pylon.secondCol[this.currentRow])
      const next = current !== this.colors.length - 1 ? current + 1 : 0
      const previous = current !== 0 ? current - 1 : this.colors.length - 1

      if (!this.commits[this.currentRow] && this.currentRow > -1) {
        if (to === 'left') {
          this.pylon.secondCol.splice(this.currentRow, 1, this.colors[previous])
        } else {
          this.pylon.secondCol.splice(this.currentRow, 1, this.colors[next])
        }
      }
    },
    commit () {
      if (this.currentRow < 0) {
        this.$toast.warning('Фиксация невозможна')
        return
      }

      if (!this.checkRow()) {
        this.$toast.warning('Все три цвета должны совпадать')
        return
      }

      this.commits.splice(this.currentRow, 1, true)
      this.currentRow--
      this.$toast.success('Фиксация ряда')
    },
    reset () {
      this.commits = [false, false, false, false]
      this.currentRow = 3
      this.setPylon()
    },
    setPylon () {
      const firstCol = this.getRandomColors()
      const secondCol = this.getRandomColors()
      const thirdCol = [...firstCol]

      this.pylon = { firstCol, secondCol, thirdCol }
    },
    getRandomColors () {
      const shuffled = [...this.colors]

      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))

        ;([shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]])
      }

      return shuffled.slice(0, Math.min(4, shuffled.length))
    },
    getColorImageName (color) {
      return `ev-${color}.png`
    },
    checkRow () {
      const row = [this.pylon.firstCol[this.currentRow], this.pylon.secondCol[this.currentRow], this.pylon.thirdCol[this.currentRow]]

      return !!row.every((color) => color === row[0])
    }
  }
}
</script>

<style lang="scss" scoped>
  .ev-wrapper {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    .preview {
      background: url("../../assets/hexagon.png") no-repeat 0 22%;
      background-size: 450px;
      width: 450px;
      .matrix {
        display: flex;
        flex-wrap: wrap;
        .matrix-item {
          height: 88px;
          width: 88px;
          img {
            width: inherit;
            height: inherit;
          }
        }
      }
    }
    .pylon {
      .pylon-columns {
        display: flex;
        justify-content: center;
      }
      .pylon-col {
        display: flex;
        flex-direction: column;
        margin: 10px;
      }
      .pylon-buttons {
        .row {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
      }
    }
  }
</style>
