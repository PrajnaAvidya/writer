<template>
  <div class="buy-amounts">
    <BTabs
      v-model="buyIndex"
      size="is-small"
      type="is-toggle"
    >
      <BTabItem label="Buy 1" />
      <BTabItem label="Buy 10" />
      <BTabItem label="Buy 100" />
    </BTabs>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'BuyAmounts',
  computed: {
    buyIndex: {
      get() {
        return this.buyAmountIndex;
      },
      set(value) {
        this.setBuyAmountIndex(value);
      },
    },
    ...mapState([
      'buyAmountIndex',
    ]),
  },
  methods: {
    ...mapMutations([
      'setBuyAmountIndex',
    ]),
  },
};
</script>

<style lang="scss">
.buy-amounts {
  width: 200px;
  margin: 0 auto;
  padding-bottom: 20px;
}
.tab-content {
  padding: 0 !important;
}
</style>
