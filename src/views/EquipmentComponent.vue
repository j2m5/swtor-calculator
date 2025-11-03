<template>
  <div class="main">
    <the-navigation />
    <div class="main-wrapper">
      <div class="buffs-content">
        <div class="buffs-block">
          <h4>Классовые бонусы</h4>
          <div class="buffs">
            <ability-popper
              v-for="(item, key) in $store.state.classBuffs"
              :key="key"
              :data="item"
              @activate="switchClasses($event)"
            />
          </div>
        </div>
        <div class="buffs-block">
          <h4>Бонусы компаньонов</h4>
          <div class="buffs">
            <ability-popper
              v-for="(item, key) in $store.state.companionBuffs"
              :key="key"
              :data="item"
              @activate="switchCompanions($event)"
            />
          </div>
        </div>
        <div class="buffs-block">
          <h4>Бонусы стимов</h4>
          <div class="buffs">
            <ability-popper
              v-for="(item, key) in $store.state.stims"
              :key="key"
              :data="item"
              @activate="switchStims($event)"
            />
          </div>
        </div>
        <div class="buffs-block">
          <h4>Разное</h4>
          <div class="buffs">
            <ability-popper
              v-for="(item, key) in $store.state.datacrons"
              :key="key"
              :data="item"
              @activate="switchDatacrons($event)"
            />
            <ability-popper
              v-for="(item, key) in $store.state.disciplineBuffs"
              :key="key + 100"
              :data="item"
              @activate="switchDiscipline($event)"
            />
            <ability-popper
              v-for="(item, key) in $store.state.guildBuffs"
              :key="key + 1000"
              :data="item"
              @activate="switchGuild($event)"
            />
          </div>
        </div>
      </div>
      <div class="main-content">
        <div class="stats">
          <div class="box">
            <h4>Ratings</h4>
            <div class="stat-section">Mastery: {{ buffedMastery }}</div>
            <div class="stat-section">Endurance: {{ buffedEndurance }}</div>
            <div class="stat-section">Power: {{ buffedPower }}</div>
            <div class="stat-section">Accuracy: {{ buffedAccuracy }}</div>
            <div class="stat-section">Alacrity: {{ alacrity }}</div>
            <div class="stat-section">Critical: {{ buffedCritical }}</div>
            <div class="stat-section">Shield: {{ shield }}</div>
            <div class="stat-section">Absorb: {{ absorb }}</div>
            <div class="stat-section">Defense: {{ buffedDefense }}</div>
            <h4>Defense</h4>
            <div class="stat-section">Health: {{ health }}</div>
            <div class="stat-section">Shield chance: {{ shieldPercent | fixNumber }}%</div>
            <div class="stat-section">Shield absorption: {{ absorbPercent | fixNumber }}%</div>
            <div class="stat-section">Defense chance: {{ defensePercent | fixNumber }}%</div>
          </div>
          <div class="box">
            <h4>Ranged/Melee</h4>
            <div class="stat-section">Bonus damage: {{ bonusDamageWhite }}</div>
            <div class="stat-section">Accuracy: {{ accuracyWhitePercent | fixNumber }}%</div>
            <div class="stat-section">Critical chance: {{ criticalChancePercent | fixNumber }}%</div>
            <div class="stat-section">Critical multiplier: {{ criticalMultiplierPercent | fixNumber }}%</div>
            <h4>Force/Tech</h4>
            <div class="stat-section">Bonus damage: {{ bonusDamageYellow }}</div>
            <div class="stat-section">Bonus healing: {{ bonusHealing }}</div>
            <div class="stat-section">Accuracy: {{ accuracyYellowPercent | fixNumber }}%</div>
            <div class="stat-section">Critical chance: {{ criticalChancePercent | fixNumber }}%</div>
            <div class="stat-section">Critical multiplier: {{ criticalMultiplierPercent | fixNumber }}%</div>
            <div class="stat-section">Energy regen rate: {{ energyRegen | fixNumber }}</div>
            <div class="stat-section">Alacrity: {{ alacrityPercent | fixNumber }}%</div>
          </div>
        </div>
        <div class="equipment">
          <div class="equipment-section">
            <b>Оружие</b>
            <div class="equipment-slots">
              <div class="mainhand">
                <item-popper
                  v-if="isNotEmptyObject(findItem('mainhand'))"
                  :item="findItem('mainhand')"
                  :data-id="findItem('mainhand').id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('mainhand'))"
                  @modify-item="openItemModal"
                />
              </div>
              <div class="offhand">
                <item-popper
                  v-if="isNotEmptyObject(findItem('offhand'))"
                  :item="findItem('offhand')"
                  :data-id="findItem('offhand').id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('offhand'))"
                  @modify-item="openItemModal"
                />
              </div>
            </div>
          </div>
          <div class="equipment-section">
            <b>Броня</b>
            <div class="equipment-slots">
              <div class="placeholder"></div>
              <div class="helmet">
                <item-popper
                  v-if="isNotEmptyObject(findItem('helmet'))"
                  :item="findItem('helmet')"
                  :data-id="findItem('helmet').id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('helmet'))"
                  @modify-item="openItemModal"
                />
              </div>
              <div class="placeholder"></div>
              <div class="wrist">
                <item-popper
                  v-if="isNotEmptyObject(findItem('wrist'))"
                  :item="findItem('wrist')"
                  :data-id="findItem('wrist').id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('wrist'))"
                  @modify-item="openItemModal"
                />
              </div>
              <div class="chest">
                <item-popper
                  v-if="isNotEmptyObject(findItem('chest'))"
                  :item="findItem('chest')"
                  :data-id="findItem('chest').id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('chest'))"
                  @modify-item="openItemModal"
                />
              </div>
              <div class="gloves">
                <item-popper
                  v-if="isNotEmptyObject(findItem('gloves'))"
                  :item="findItem('gloves')"
                  :data-id="findItem('gloves').id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('gloves'))"
                  @modify-item="openItemModal"
                />
              </div>
              <div class="boots">
                <item-popper
                  v-if="isNotEmptyObject(findItem('boots'))"
                  :item="findItem('boots')"
                  :data-id="findItem('boots')"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('boots'))"
                  @modify-item="openItemModal"
                />
              </div>
              <div class="waist">
                <item-popper
                  v-if="isNotEmptyObject(findItem('waist'))"
                  :item="findItem('waist')"
                  :data-id="findItem('waist').id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('waist'))"
                  @modify-item="openItemModal"
                />
              </div>
              <div class="legs">
                <item-popper
                  v-if="isNotEmptyObject(findItem('legs'))"
                  :item="findItem('legs')"
                  :data-id="findItem('legs').id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('legs'))"
                  @modify-item="openItemModal"
                />
              </div>
            </div>
          </div>
          <div class="equipment-section">
            <b>Разное</b>
            <div class="equipment-slots">
              <div class="ear">
                <item-popper
                  v-if="isNotEmptyObject(findItem('ear'))"
                  :item="findItem('ear')"
                  :data-id="findItem('ear').id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('ear'))"
                  @modify-item="openItemModal"
                />
              </div>
              <div class="implant">
                <item-popper
                  v-if="isNotEmptyObject(findItem('implant'))"
                  :item="findItem('implant')"
                  :data-id="findItem('implant').id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('implant'))"
                  @modify-item="openItemModal"
                />
              </div>
              <div class="implant">
                <item-popper
                  v-if="isNotEmptyObject(findItem('implant', 1))"
                  :item="findItem('implant', 1)"
                  :data-id="findItem('implant', 1).id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('implant', 1))"
                  @modify-item="openItemModal"
                />
              </div>
              <div class="relic">
                <item-popper
                  v-if="isNotEmptyObject(findItem('relic'))"
                  :item="findItem('relic')"
                  :data-id="findItem('relic').id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('relic'))"
                  @modify-item="openItemModal"
                />
              </div>
              <div class="relic">
                <item-popper
                  v-if="isNotEmptyObject(findItem('relic', 1))"
                  :item="findItem('relic', 1)"
                  :data-id="findItem('relic', 1).id"
                  reference-class="item-inventory"
                  class="cell-content"
                  @add-item="dropItem(findItem('relic', 1))"
                  @modify-item="openItemModal"
                />
              </div>
            </div>
            <div class="ai-helper">
              <the-button btn-text="Спросить ИИ" @btn-click="openAIModal" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <the-modal :visible="aiModal">
      <template #header>
        <div>Добро пожаловать! Я Alfe AI твой помощник в сборке лучшего гира в SWTOR!</div>
      </template>
      <template #main>
        <scrolly class="scrollbar" :parentScroll="false" :style="{ width: '1000px', height: '500px' }">
          <scrolly-viewport>
            <div v-if="visibleHistory.length" class="chat">
              <div v-for="message in visibleHistory" :key="message.id" class="ai-comment">
                <div class="ai-comment-head">
                  <div class="ai-avatar">
                    <img src="../assets/alfe.png" alt="">
                  </div>
                  <div class="ai-name">
                    <div>Alfe AI</div>
                  </div>
                </div>
                <div class="ai-comment-content">
                  <div v-if="Array.isArray(message.response)" class="ai-response">
                    <div v-for="item in alfeAI.reasoning.map((x) => x.response)" :key="item.id">
                      <vue-typed-js :strings="[item]" :type-speed="10" :start-delay="3000" :show-cursor="false">
                        <i class="typing" style="margin: 5px 0; font-size: 12px;" />
                      </vue-typed-js>
                    </div>
                    <div v-for="(item, index) in message.response" :key="index">
                      <vue-typed-js :strings="[item]" :type-speed="12" :start-delay="3000" :show-cursor="false">
                        <span class="typing" />
                      </vue-typed-js>
                    </div>
                    <div style="margin: 5px 0;">
                      <the-button btn-text="Применить полученный билд?" @btn-click="applyAIGeneratedBuild" />
                    </div>
                  </div>
                  <div v-else class="ai-response">
                    <vue-typed-js :strings="[message.response]" :type-speed="10" :show-cursor="false">
                      <span class="typing" />
                    </vue-typed-js>
                  </div>
                </div>
              </div>
              <div class="hr" />
            </div>
          </scrolly-viewport>
          <scrolly-bar axis="y" />
        </scrolly>
        <div class="user-request">
          <div>Собери билд для класса:</div>
          <div>
            <select v-model="selectedClass">
              <option v-for="(item, key) in classes" :key="key" :value="item">{{ item }}</option>
            </select>
          </div>
          <div>для дисциплины:</div>
          <div>
            <select v-model="selectedDiscipline">
              <option v-for="(item, key) in filteredDisciplines" :key="key" :value="item.name">{{ item.name }}</option>
            </select>
          </div>
          <div>используй аугменты рейтинга:</div>
          <div>
            <select v-model="selectedAugmentRating">
              <option v-for="(rating, key) in augmentRatings" :key="key" :value="rating">{{ rating }}</option>
            </select>
          </div>
          <div class="mt-5">
            <the-button btn-text="Отправить" @btn-click="ask" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex-container flex-center-axis-x flex-center-axis-y">
          <the-button btn-text="Закрыть" @btn-click="aiModal = false" />
          <the-button btn-text="Очистить историю" @btn-click="clearAIHistory" />
        </div>
      </template>
    </the-modal>
  </div>
</template>

<script>
import { Scrolly, ScrollyViewport, ScrollyBar } from 'vue-scrolly'
import { VueTypedJs } from 'vue-typed-js'
import isNotEmptyObject from '@/mixins/isNotEmptyObject'
import openAndCloseModal from '@/mixins/openAndCloseModal'
import { mapState, mapGetters } from 'vuex'
import { AlfeAI } from '@/helpers/AlfeAI'
import classes from '@/data/classes'
import disciplines from '@/data/disciplines'
const TheNavigation = () => import('@/components/generic/TheNavigation')
const TheButton = () => import('@/components/generic/TheButton')
const TheModal = () => import('@/components/generic/TheModal')
const ItemPopper = () => import('@/components/specific/ItemPopper')
const AbilityPopper = () => import('@/components/specific/AbilityPopper')
export default {
  name: 'EquipmentComponent',
  components: {
    TheNavigation,
    TheButton,
    TheModal,
    ItemPopper,
    AbilityPopper,
    VueTypedJs,
    Scrolly,
    ScrollyViewport,
    ScrollyBar
  },
  mixins: [isNotEmptyObject, openAndCloseModal],
  filters: {
    fixNumber (number) {
      return number.toFixed(2)
    }
  },
  data () {
    return {
      aiModal: false,
      alfeAI: new AlfeAI(),
      alfeAIResponse: null,
      alfeAIHistory: [],
      visibleHistory: [],
      timer: null,
      selectedClass: 'Juggernaut/Guardian',
      selectedDiscipline: 'Immortal/Defense',
      selectedAugmentRating: 286,
      classes,
      disciplines,
      augmentRatings: [286, 300, 302, 310, 318],
      request: ''
    }
  },
  watch: {
    selectedClass (value) {
      this.selectedDiscipline = this.disciplines.find((el) => el.boundToClass === value).name
    },
    alfeAIHistory: {
      handler(newVal) {
        if (Array.isArray(newVal)) {
          this.startTypingSequence(newVal)
        } else {
          this.alfeAIHistory = []
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      equipment: state => state.equipment,
      mastery: state => state.user.mastery,
      endurance: state => state.user.endurance,
      power: state => state.user.power,
      accuracy: state => state.user.accuracy,
      alacrity: state => state.user.alacrity,
      critical: state => state.user.critical,
      shield: state => state.user.shield,
      absorb: state => state.user.absorb,
      defense: state => state.user.defense
    }),
    ...mapGetters([
      'buffedMastery',
      'buffedEndurance',
      'buffedAccuracy',
      'buffedCritical',
      'buffedDefense',
      'buffedPower',
      'accuracyWhitePercent',
      'accuracyYellowPercent',
      'alacrityPercent',
      'criticalChancePercent',
      'criticalMultiplierPercent',
      'defensePercent',
      'shieldPercent',
      'absorbPercent',
      'energyRegen',
      'health',
      'bonusDamageWhite',
      'bonusDamageYellow',
      'bonusHealing'
    ]),
    filteredDisciplines () {
      return this.disciplines.filter((el) => el.boundToClass === this.selectedClass)
    }
  },
  created () {
    this.alfeAIHistory = this.alfeAI.history
  },
  beforeDestroy () {
    if (this.timer) clearTimeout(this.timer)
  },
  methods: {
    findItem (category, index = 0) {
      const result = this.equipment.filter(x => x.category === category)
      return result[index] || {}
    },
    dropItem (item) {
      this.$store.dispatch('dropItem', item)
    },
    switchDatacrons (data) {
      this.$store.commit('activateOrDeactivateDatacronBuff', data)
    },
    switchCompanions (data) {
      this.$store.commit('activateOrDeactivateCompanionBuff', data)
    },
    switchClasses (data) {
      this.$store.commit('activateOrDeactivateClassBuff', data)
    },
    switchStims (data) {
      const active = this.$store.state.stims.filter(x => x.active)
      if (!data.active && active.length >= 1) {
        this.$toast.warning('Нельзя активировать более одного стима одновременно')
        return
      }
      this.$store.commit('activateOrDeactivateStim', data)
    },
    switchGuild (data) {
      const active = this.$store.state.guildBuffs.filter(x => x.active)
      if (!data.active && active.length >= 1) {
        this.$toast.warning('Нельзя активировать более одного гильдейского бонуса одновременно')
        return
      }
      this.$store.commit('activateOrDeactivateGuildBuff', data)
    },
    switchDiscipline (data) {
      const active = this.$store.state.disciplineBuffs.filter(x => x.active)
      if (!data.active && active.length >= 1) {
        this.$toast.warning('Нельзя активировать более одного бонуса от дисциплины одновременно')
        return
      }
      this.$store.commit('activateOrDeactivateDisciplineBuff', data)
    },
    openAIModal () {
      this.aiModal = true

      if (!this.alfeAI.history.length) {
        this.alfeAI.hello()
      }
    },
    ask () {
      this.alfeAI.getResponse([this.selectedClass, this.selectedDiscipline, this.selectedAugmentRating])
      this.alfeAIResponse = this.alfeAI.response
      this.alfeAIHistory = [...this.alfeAI.history]
    },
    clearAIHistory () {
      this.alfeAI.clearHistory()
      this.alfeAIHistory = [...this.alfeAI.history]
      this.visibleHistory = []
      this.alfeAIResponse = null
    },
    startTypingSequence(messages) {
      this.visibleHistory = []

      if (this.timer) clearTimeout(this.timer)

      messages.forEach((el, i) => {
        this.timer = setTimeout(() => {
          this.visibleHistory.push(el)
        }, i * 1500)
      })
    },
    applyAIGeneratedBuild () {
      this.alfeAIResponse.forEach((el) => {
        this.$store.dispatch('buyItem', el)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../styles/variables";
  @import "../styles/base";
  .main {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    border-image-slice: 0 27 0 27;
    border-image-width: 0px 20px 0px 20px;
    border-image-outset: 0px 0px 0px 0px;
    border-image-repeat: stretch stretch;
    border-image-source: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZMAAAK8CAYAAAAqDlIfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGj2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDMDg2NTlDOUU4RjlFMDExOUUxQ0UxOTRGQUI1MjhDNiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowQzdCRkM0NDQ4NzcxMUUxQjA1OUFDREQ4NTRBNDM4QiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowYjU1YTBhNi00MDMwLWFkNDgtOTE3Yi04YTZiNjY5MDc0MTIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0xMi0xOFQxNzowNzoyNiswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMTItMThUMjI6MTU6MjkrMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMTItMThUMjI6MTU6MjkrMDM6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkQxREE3MzFERDAwRTExMUI4ODNCQkRGODU2M0ExQTYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzA4NjU5QzlFOEY5RTAxMTlFMUNFMTk0RkFCNTI4QzYiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NWRjZjAxYmUtMmUyMy1jYjRhLThlMzMtYzdlNzY2MGU3NjhjIiBzdEV2dDp3aGVuPSIyMDIyLTEyLTE4VDIxOjUwOjM5KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBiNTVhMGE2LTQwMzAtYWQ0OC05MTdiLThhNmI2NjkwNzQxMiIgc3RFdnQ6d2hlbj0iMjAyMi0xMi0xOFQyMjoxNToyOSswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgcKYCQAAHmFSURBVHic7P3Js2XZdef5fdfa+9z73nMP90C06AiAINg3AJkkMyllKSvZVWZVqsxKE/0B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");
    border-style: solid;
    height: inherit;
    width: 814px;
    .main-wrapper {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: space-evenly;
      height: 95%;
      .buffs-content {
        display: flex;
        justify-content: space-around;
        width: inherit;
        .buffs-block {
          text-align: center;
          h4 {
            margin: 5px 0;
          }
          .buffs {
            display: flex;
            justify-content: center;
            margin-top: 10px;
            text-align: center;
          }
        }
      }
      .main-content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: inherit;
        .stats {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          font-size: 12px;
          width: 350px;
          .box {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          h4 {
            margin: 10px 0;
          }
          .stat-section {
            padding: 5px 0;
          }
        }
        .equipment {
          .equipment-section {
            margin-bottom: 10px;
            text-align: center;
            width: 150px;
            .equipment-slots {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              margin-top: 5px;
              div {
                border: 1px solid #0c3a52;
                border-radius: 3px;
                margin: 3px;
                height: 35px;
                width: 35px;
              }
              div.placeholder {
                visibility: hidden;
              }
            }
            .ai-helper {
              margin-top: 20px;
            }
          }
        }
      }
    }
    .scrollbar .scrolly-bar:before {
      background: #2893b7;
      width: 30%;
      right: -15px;
    }
    .ai-comment {
      margin: 15px 0;
      .ai-comment-head {
        display: flex;
        align-items: center;
        .ai-avatar {
          border-radius: 50%;
          display: flex;
          height: 40px;
          width: 40px;
          overflow: hidden;
          margin-right: 5px;
        }
        .ai-name {
          color: $yellow;
          text-align: center;
        }
      }
      .ai-comment-content {
        margin-top: 10px;
        .ai-response {
          display: block;
        }
      }
    }
    ::v-deep .vfm-content {
      width: 1000px !important;
    }
  }
</style>
