<template>
  <div class="ev-wrapper">
    <div class="preview">
      <div class="current-row">
        <h1>{{ currentRow + 1 }}</h1>
        <div>Текущий ряд</div>
      </div>
      <div class="matrix-wrapper">
        <div class="matrix">
          <div v-for="(item, index) in preview" :key="index" class="matrix-item">
            <img v-if="item" :src="require(`../../assets/ev-${item}.png`)" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="pylon">
      <div class="pylon-columns">
        <div :style="{ visibility: mode === 'calibration' ? 'visible' : 'hidden' }" class="pylon-calibration-col">
          <div v-for="(item, index) in pylon.firstCol" :key="index">
            <the-button btn-text="Влево (Л/П)" @btn-click="calibrate('left', index)" />
            <the-button btn-text="Влево (Центр)" @btn-click="calibrateCenter('left', index)" />
          </div>
        </div>
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
        <div :style="{ visibility: mode === 'calibration' ? 'visible' : 'hidden' }" class="pylon-calibration-col">
          <div v-for="(item, index) in pylon.firstCol" :key="index">
            <the-button btn-text="Вправо (Л/П)" @btn-click="calibrate('right', index)" />
            <the-button btn-text="Вправо (Центр)" @btn-click="calibrateCenter('right', index)" />
          </div>
        </div>
      </div>
      <div class="pylon-buttons">
        <div class="row">
          <div class="mode">
            <the-button btn-text="Режим калибровки пилона" @btn-click="setMode('calibration')" />
          </div>
          <div class="mode">
            <the-button btn-text="Режим вращения пилона" @btn-click="setMode('rotation')" />
          </div>
        </div>
      </div>
      <div v-if="mode === 'rotation'" class="pylon-buttons">
        <div class="row">
          <the-button btn-text="Влево" @btn-click="rotate('left')" />
          <the-button btn-text="Фиксация" @btn-click="commit" />
          <the-button btn-text="Вправо" @btn-click="rotate('right')" />
        </div>
        <div class="row">
          <the-button btn-text="Сброс" @btn-click="reset" />
        </div>
        <div class="rotation-info">
          <div>Для сборки текущего ряда нужно повернуть пилон:</div>
          <div>{{ steps.leftStepsCount }} раз(а) влево, или</div>
          <div>{{ steps.rightStepsCount }} раз(а) вправо</div>
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
      mode: 'calibration',
      pylon: {},
      matrix: Array(25).fill(null),
      colors: ['white', 'purple', 'yellow', 'red', 'blue', 'green'],
      commits: [false, false, false, false],
      currentRow: 3,
      rotationDeg: 0
    }
  },
  computed: {
    steps () {
      const { current } = this.getMetadata(this.pylon.secondCol)
      const target = this.colors.indexOf(this.pylon.firstCol[this.currentRow])

      const total = this.colors.length

      const leftStepsCount = (current - target + total) % total
      const rightStepsCount = (target - current + total) % total

      return { leftStepsCount, rightStepsCount }
    },
    preview () {
      const indexes = [2, 5, 9, 15, 19, 22].reverse()

      indexes.forEach((el, index) => {
        this.matrix.splice(el, 1, this.colors[index])
      })

      return this.matrix
    }
  },
  created () {
    this.getPylon()
  },
  methods: {
    rotate (to) {
      if (!this.validate(['left', 'right'], to)) return

      const { next, previous } = this.getMetadata(this.pylon.secondCol)

      const step = 60

      this.rotationDeg += to === 'left' ? -step : step

      if (!this.commits[this.currentRow] && this.currentRow > -1) {
        if (to === 'left') {
          this.pylon.secondCol.splice(this.currentRow, 1, this.colors[previous])
        } else {
          this.pylon.secondCol.splice(this.currentRow, 1, this.colors[next])
        }
      }
    },
    calibrate (to, row) {
      if (!this.validate(['left', 'right'], to)) return

      const { next, previous } = this.getMetadata(this.pylon.firstCol, row)

      if (to === 'left') {
        this.pylon.firstCol.splice(row, 1, this.colors[previous])
        this.pylon.thirdCol.splice(row, 1, this.colors[previous])
      } else {
        this.pylon.firstCol.splice(row, 1, this.colors[next])
        this.pylon.thirdCol.splice(row, 1, this.colors[next])
      }
    },
    calibrateCenter (to, row) {
      if (!this.validate(['left', 'right'], to)) return

      const { next, previous } = this.getMetadata(this.pylon.secondCol, row)

      if (to === 'left') {
        this.pylon.secondCol.splice(row, 1, this.colors[previous])
      } else {
        this.pylon.secondCol.splice(row, 1, this.colors[next])
      }
    },
    commit () {
      if (this.currentRow < 0) {
        this.$toast.warning('Фиксация невозможна')
        return
      }

      if (!this.checkRow()) {
        this.$toast.warning('Все цвета должны совпадать')
        return
      }

      this.commits.splice(this.currentRow, 1, true)
      this.currentRow--
      this.$toast.success('Фиксация ряда')
    },
    reset () {
      this.commits = [false, false, false, false]
      this.currentRow = 3

      this.getPylon()
    },
    getPylon () {
      const firstCol = this.getRandomColors()
      const secondCol = this.getRandomColors()
      const thirdCol = [...firstCol]

      this.pylon = { firstCol, secondCol, thirdCol }
    },
    setMode (mode) {
      if (!this.validate(['calibration', 'rotation'], mode)) return

      this.mode = mode
    },
    getMetadata (column, row = null) {
      const current = row !== null ? this.colors.indexOf(column[row]) : this.colors.indexOf(column[this.currentRow])
      const next = current !== this.colors.length - 1 ? current + 1 : 0
      const previous = current !== 0 ? current - 1 : this.colors.length - 1

      return { current, next, previous }
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
    validate (array, input) {
      return !!array.includes(input)
    },
    checkRow () {
      const row = [
        this.pylon.firstCol[this.currentRow],
        this.pylon.secondCol[this.currentRow],
        this.pylon.thirdCol[this.currentRow]
      ]

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
      background: url("../../assets/hexagon.png") no-repeat 0 45%;
      background-size: 440px;
      position: relative;
      height: 100%;
      width: 450px;
      .current-row {
        position: absolute;
        left: 38%;
        top: 33%;
        text-align: center;
        h1 {
          font-size: 75px;
          margin: 0;
        }
        div {
          font-size: 14px;
        }
      }
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
      height: 100%;
      .pylon-columns {
        display: flex;
        justify-content: center;
      }
      .pylon-col {
        display: flex;
        flex-direction: column;
        margin: 10px;
      }
      .pylon-calibration-col {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        div {
          button {
            margin: 5px 0;
            display: block;
          }
        }
      }
      .pylon-buttons {
        .row {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .rotation-info {
          margin-top: 10px;
          text-align: center;
        }
      }
    }
  }
</style>
