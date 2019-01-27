<template>
  <div class="home">
    <BuyAmounts />

    <ProductionGrid />
  </div>
</template>

<script>
import BuyAmounts from '@/components/BuyAmounts.vue';
import ProductionGrid from '@/components/ProductionGrid.vue';

export default {
  name: 'Workers',
  components: {
    BuyAmounts,
    ProductionGrid,
  },
};
</script>
