<template>
  <div class="container">
    <VendorComponent />
    <EquipmentComponent />
    <InventoryComponent />
  </div>
</template>

<script>
const VendorComponent = () => import('@/views/VendorComponent')
const EquipmentComponent = () => import('@/views/EquipmentComponent')
const InventoryComponent = () => import('@/views/InventoryComponent')
export default {
  name: 'MainComponent',
  components: { VendorComponent, EquipmentComponent, InventoryComponent }
}
</script>

<style lang="scss">
  @import "./../styles/_variables.scss";
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: inherit;
  }
</style>
