<template>
  <div class="nav">
    <router-link :to="{ name: 'Main' }" exact>Главная</router-link> /
    <router-link :to="{ name: 'Dashboard' }" exact>Подробнее</router-link> /
    <router-link :to="{ name: 'Operations' }" exact>Операции</router-link> /
    <router-link :to="{ name: 'Builds' }" exact>Сохраненные билды</router-link>
  </div>
</template>

<script>
export default {
  name: 'TheNavigation'
}
</script>

<style lang="scss" scoped>
  .nav {
    text-align: center;
    a {
      color: #d4d1cb;
      font-size: 14px;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
      &.router-link-active {
        color: #85827d;
      }
    }
  }
</style>
