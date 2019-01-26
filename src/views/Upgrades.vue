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
  props: {
    workers: {
      type: Object,
      required: true,
    },
    upgrades: {
      type: Object,
      required: true,
    },
    money: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
