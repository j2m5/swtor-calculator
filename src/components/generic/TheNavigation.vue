<template>
  <div class="nav">
    <router-link to="/" exact>Главная</router-link> / <router-link to="/dashboard" exact>Подробнее</router-link> / <router-link to="/builds">Сохраненные билды</router-link>
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
      &.router-link-active {
        color: #85827d;
      }
    }
  }
</style>
