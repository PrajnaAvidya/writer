<template>
  <div>
    <div
      v-for="workerId in Object.keys(upgrades.workers)"
      :key="workerId"
    >
      <div
        v-if="size(upgrades.workers[workerId]) > 0"
      >
        <h3 style="upgrade-title">
          {{ workerId }} Upgrades
        </h3>
        <div
          v-for="upgrade in orderedUpgrades(upgrades.workers[workerId])"
          :key="upgrade.id"
        >
          {{ upgrade }}
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <strong>Upgrade Name</strong>
      </div>
      <div class="column">
        Upgrade Description/Cost
      </div>
      <div class="column">
        <a
          class="button"
          @click="$emit('buyUpgrade', upgrade.id)"
        >
          Buy ($1000)
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import lodash_size from 'lodash/size';

export default {
  name: 'UpgradePanel',
  props: {
    upgrades: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    console.log(this.upgrades);
  },
  methods: {
    orderedUpgrades(list) {
      return this.$options.filters.order(list);
    },
    size(list) {
      return lodash_size(list);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
