<template>
  <div class="buy-amounts">
      <b-tabs
        size="is-small"
        type="is-toggle"
        @change="$emit('setBuyAmount', $event)"
      >
        <b-tab-item label="Buy 1"></b-tab-item>
        <b-tab-item label="Buy 10"></b-tab-item>
        <b-tab-item label="Buy 100"></b-tab-item>
      </b-tabs>
    </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>

</style>
