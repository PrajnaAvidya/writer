<template>
  <div>
    <UpgradePanel
      :upgrades="upgrades"
      :workers="workers"
      :money="money"
    />
  </div>
</template>

<script>
import UpgradePanel from '@/components/UpgradePanel.vue';

export default {
  name: 'Upgrades',
  components: {
    UpgradePanel,
  },
};
</script>

<style lang="scss" scoped>

</style>
