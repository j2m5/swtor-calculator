export default {
  methods: {
    openItemModal (item) {
      this.$store.commit('updateModifiableItem', item)
      document.querySelector('.item-modal').classList.add('open')
    },
    closeItemModal () {
      this.$store.commit('updateModifiableItem', {})
      document.querySelector('.item-modal').classList.remove('open')
    }
  }
}
