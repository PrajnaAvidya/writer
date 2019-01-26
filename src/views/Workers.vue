<template>
  <div class="home">
    <BuyAmounts />

    <ProductionGrid
      :workers="workers"
      :assignments="assignments"
      :money="money"
    />
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
  props: {
    workers: {
      type: Object,
      required: true,
    },
    assignments: {
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
