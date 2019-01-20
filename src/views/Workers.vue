<template>
  <div class="home">
    <UpgradePanel
      :show-upgrades="showUpgrades"
      :upgrades="upgrades"
      :workers="workers"
    />
    <hr>
    <ProductionGrid
      :show-production="showProduction"
      :workers="workers"
      :assignments="assignments"
    />
  </div>
</template>

<script>
import ProductionGrid from '../components/ProductionGrid.vue';
import UpgradePanel from '../components/UpgradePanel.vue';

export default {
  name: 'Workers',
  components: {
    ProductionGrid,
    UpgradePanel,
  },
  props: {
    showProduction: Boolean,
    showUpgrades: Boolean,
    workers: {
      type: Object,
      required: true,
    },
    upgrades: {
      type: Object,
      required: true,
    },
    assignments: {
      type: Object,
      required: true,
    },
  },
};
</script>
