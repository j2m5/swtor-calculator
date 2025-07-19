<template>
  <div>
    <the-navigation />
    <scrolly v-if="builds.length" class="scrollbar" :parentScroll="false" :style="{ width: '800px', height: '700px' }">
      <scrolly-viewport>
        <div class="scrollable-table">
          <table>
            <tr>
              <th>Имя</th>
              <th>Ключ</th>
              <th>Действия</th>
            </tr>
            <tr v-for="build in builds" :key="build.id">
              <td>{{ build.name }}</td>
              <td>{{ build.key }}</td>
              <td>
                <div class="actions">
                  <div class="link clickable" @click="loadBuild(build.key)">[Загрузить]</div>
                  <div class="link clickable" @click="confirmDeletion(build.key)">[Удалить]</div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </scrolly-viewport>
      <scrolly-bar axis="y" />
    </scrolly>
    <div v-else class="empty">Нет сохраненных билдов</div>
    <confirm-modal
      :visible="confirmDeletionModal"
      action-text="Удалить билд?"
      confirm-btn-text="Удалить"
      reject-btn-text="Отменить"
      @confirm="deleteBuild(confirmData)"
      @reject="clear"
    />
  </div>
</template>

<script>
import { db } from '@/database'
import { Scrolly, ScrollyViewport, ScrollyBar } from 'vue-scrolly'
const TheNavigation = () => import('@/components/generic/TheNavigation')
const ConfirmModal = () => import('@/components/specific/ConfirmModal')
export default {
  name: 'BuildsComponent',
  components: { Scrolly, ScrollyViewport, ScrollyBar, TheNavigation, ConfirmModal },
  data () {
    return {
      confirmDeletionModal: false,
      confirmData: null,
      builds: []
    }
  },
  created () {
    this.getBuilds()
  },
  methods: {
    confirmDeletion (key) {
      this.confirmDeletionModal = true
      this.confirmData = key
    },
    clear () {
      this.confirmDeletionModal = false
      this.confirmData = null
    },
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
    async deleteBuild (key) {
      try {
        const response = await this.$store.dispatch('deleteBuild', key)
        await this.getBuilds()
        this.$toast.success(response)
        this.clear()
      } catch (e) {
        this.$toast.error(e.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .scrollable-table {
    margin-top: 15px;
    border: 1px solid #444444;
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #444444;
      padding: 5px 50px;
      text-align: left;
    }
    th {
      background-color: #0e3662;
    }
    .actions {
      display: flex;
      .link {
        color: #fdd31c;
        cursor: pointer;
        margin-right: 5px;
      }
    }
  }
  .scrollbar .scrolly-bar:before {
    background: #0e3662;
    width: 30%;
    right: -15px;
  }
</style>
