export default {
  mounted () {
    const inventory = this.$refs.inventory
    inventory.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', e.target.parentElement.dataset.slot)
      e.target.classList.add('dragging')
    })
    inventory.addEventListener('dragover', e => {
      e.preventDefault()
      const draggingElement = inventory.querySelector('.dragging')
      const currentElement = e.target
      const isMovable = draggingElement !== currentElement && currentElement.classList.contains('cell')
      if (!isMovable) return
      if (currentElement.children.length) return
      currentElement.appendChild(draggingElement)
    })
    inventory.addEventListener('dragend', e => {
      // FIXME эта хуйня что чуть ниже работает через жопу
      // const oldIndex = Number(e.dataTransfer.getData('text'))
      // const newIndex = Number(e.target.parentElement.dataset.slot)
      // this.$store.commit('moveItem', { oldIndex, newIndex })
      e.target.classList.remove('dragging')
    })
  }
}
