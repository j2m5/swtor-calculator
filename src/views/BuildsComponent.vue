<template>
  <div>
    <the-navigation />
    <div v-if="builds.length" class="list">
      <div v-for="build in builds" :key="build.id" class="list-item">
        <div><b>Имя:</b> {{ build.name }}</div>
        <div><b>Ключ:</b> {{ build.key }}</div>
        <div class="buttons">
          <the-button btn-text="Загрузить" @btn-click="loadBuild(build.key)" />
          <the-button btn-text="Удалить" @btn-click="deleteBuild(build.key)" />
        </div>
      </div>
    </div>
    <div v-else class="empty">Нет сохраненных билдов</div>
  </div>
</template>

<script>
import { db } from '@/database'
const TheNavigation = () => import('@/components/generic/TheNavigation')
const TheButton = () => import('@/components/generic/TheButton')
export default {
  name: 'BuildsComponent',
  components: { TheNavigation, TheButton },
  data () {
    return {
      builds: []
    }
  },
  created () {
    this.getBuilds()
  },
  methods: {
    async getBuilds () {
      try {
        this.builds = await db.builds.toArray()
      } catch (e) {
        this.$toast.warning(e)
      }
    },
    async loadBuild (key) {
      try {
        const response = await this.$store.dispatch('loadBuild', key)
        await this.$router.push({ name: 'Main' })
        this.$toast.success(response)
      } catch (e) {
        this.$toast.error(e.message)
      }
    },
    async deleteBuild (key) {}
  }
}
</script>

<style lang="scss" scoped>
  .list, .empty {
    margin-top: 10px;
    .list-item {
      margin: 5px 0;
      padding: 3px 0;
      border-bottom: 1px dotted #d4d1cb;
      &:last-child {
        border-bottom: none;
      }
      .buttons {
        margin: 10px 0 5px;
      }
    }
  }
</style>
