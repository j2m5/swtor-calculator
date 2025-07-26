<template>
  <div class="operations">
    <the-navigation />
    <div v-if="$route.path === '/operations'">
      <div class="utilities-list">
        <div>
          <router-link :to="{ name: 'EternityVault' }" class="link">Eternity Vault - The Ancient Pylons</router-link>
        </div>
      </div>
    </div>
    <router-view v-else />
  </div>
</template>

<script>
const TheNavigation = () => import('@/components/generic/TheNavigation')
export default {
  name: 'OperationsComponent',
  components: { TheNavigation }
}
</script>

<style lang="scss" scoped>
  .operations {
    width: 95%;
    height: 95%;
    .utilities-list {
      .link {
        color: #fdd31c;
        cursor: pointer;
        margin-right: 5px;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
