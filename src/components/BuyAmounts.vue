<template>
  <div class="buy-amounts">
    <BTabs
      size="is-small"
      type="is-toggle"
      @change="$emit('setBuyAmount', $event)"
    >
      <BTabItem label="Buy 1" />
      <BTabItem label="Buy 10" />
      <BTabItem label="Buy 100" />
    </BTabs>
  </div>
</template>

<script>
export default {
  name: 'BuyAmounts',
};
</script>

<style lang="scss">
.buy-amounts {
  width: 200px;
  margin: 0 auto;
}
.tab-content {
  padding: 0 !important;
}
</style>
