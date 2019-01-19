<template>
  <div class="home">
    <UpgradePanel
      :show-upgrades="showUpgrades"
      :upgrades="upgrades"
      :workers="workers"
    />

    <ProductionGrid
      :show-production="showProduction"
      :buy-amount="buyAmount"
      :workers="workers"
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
    buyAmount: {
      type: Number,
      required: true,
    },
    workers: {
      type: Object,
      required: true,
    },
    upgrades: {
      type: Object,
      required: true,
    },
  },
};
</script>
