<template>
  <popper trigger="hover" :append-to-body="true" :visible-arrow="false" :options="popperOptions">
    <div class="popper">
      <h4>Предметы</h4>
      <ul>
        <li>1) РКМ: купить предмет, одеть предмет (если его можно одеть), снять предмет, вставить мод в предмет или извлечь из предмета</li>
        <li>2) CTRL+ЛКМ: открыть окно модификации предмета</li>
        <li>3) ALT+ЛКМ: удалить предмет (можно удалить только предмет лежащий в инвентаре)</li>
      </ul>
      <h4>Сохранение готового билда</h4>
      <ul>
        <li>1) Можно сохранить готовый билд</li>
        <li>2) На странице "Сохраненные билды" имеется список всех созданных билдов</li>
      </ul>
    </div>
    <div slot="reference" class="helper clickable">
      <h3>Помощь</h3>
    </div>
  </popper>
</template>

<script>
import Popper from 'vue-popperjs'
import 'vue-popperjs/dist/vue-popper.css'
export default {
  name: 'HelperPopper',
  components: { popper: Popper },
  data () {
    return {
      popperOptions: {
        placement: 'top',
        modifiers: {
          offset: {
            offset: '0,20px'
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/variables";
  @import "../../styles/base";
  .popper {
    h4 {
      margin: 10px 0;
    }
    ul {
      margin: 0;
      padding: 5px 10px;
      list-style: none;
      li {
        margin-bottom: 10px;
      }
    }
  }
  .helper {
    cursor: pointer;
    display: inline-block;
  }
</style>
