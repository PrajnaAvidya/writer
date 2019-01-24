<template>
  <div class="home">
    <ProductionGrid
      :workers="workers"
      :assignments="assignments"
      :money="money"
    />
  </div>
</template>

<script>
import ProductionGrid from '../components/ProductionGrid.vue';

export default {
  name: 'Workers',
  components: {
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
