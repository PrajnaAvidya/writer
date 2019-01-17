<template>
  <div>
    <div
      v-for="workerId in Object.keys(upgrades.workers)"
      :key="workerId"
    >
      <div v-if="size(upgrades.workers[workerId]) > 0">
        <h3 class="upgrade-title">
          {{ workers[workerId].name }} Upgrades
        </h3>
        <div
          v-for="upgrade in orderedUpgrades(upgrades.workers[workerId])"
          :key="upgrade.id"
          class="columns"
        >
          <div class="column">
            <strong>{{ upgrade.name }}</strong>
          </div>
          <div class="column">
            {{ upgrade.description }}
          </div>
          <div class="column">
            <a
              class="button"
              @click="buyUpgrade(upgrade)"
            >
              {{ upgradeCost(upgrade) }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lodashSize from 'lodash/size';

export default {
  name: 'UpgradePanel',
  props: {
    upgrades: {
      type: Object,
      required: true,
    },
    workers: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    // console.log(this.upgrades);
  },
  methods: {
    buyUpgrade(upgrade) {
      // TODO
      console.log(upgrade);
    },
    orderedUpgrades(list) {
      return this.$options.filters.order(list);
    },
    size(list) {
      return lodashSize(list);
    },
    upgradeCost(upgrade) {
      if (!('cost' in upgrade)) {
        return 'FREE';
      }
      const costs = [];
      if ('money' in upgrade.cost) {
        costs.push(this.$options.filters.money(upgrade.cost.money));
      }
      if ('reputation' in upgrade.cost) {
        costs.push(`${this.$options.filters.round(upgrade.cost.reputation)} rep`);
      }
      return costs.join(' - ');
    },
  },
};
</script>

<style lang="scss" scoped>
.upgrade-title {
  font-weight: bold;
}
</style>
