<template>
  <div
    class="upgrades"
    :hidden="!showUpgrades"
  >
    <div
      v-for="upgrade in orderedUpgrades(upgrades)"
      :key="upgrade.id"
      class="columns"
    >
      <div class="column">
        <strong>{{ upgrade.name }}</strong>
      </div>
      <div class="column">
        {{ descriptionText(upgrade) }}
        <br>
        {{ requirementsText(upgrade) }}
      </div>
      <div class="column">
        <a
          class="button"
          @click="buyUpgrade(upgrade)"
        >
          {{ upgrade.cost | money }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpgradePanel',
  props: {
    showUpgrades: Boolean,
    upgrades: {
      type: Object,
      required: true,
    },
    workers: {
      type: Object,
      required: true,
    },
    money: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    // console.log(this.upgrades);
  },
  methods: {
    buyUpgrade(upgrade) {
      // check requirements
      if (upgrade.requirements) {
        let metRequirements = Object.keys(upgrade.requirements).every((workerId) => {
          const required = upgrade.requirements[workerId];
          if (this.workers[workerId].quantity.lt(required)) {
            console.log(`Not enough ${workerId}`);
            metRequirements = false;
            return false;
          }
          return true;
        });

        if (!metRequirements) {
          return;
        }
      }

      // costs
      if (upgrade.cost) {
        // check costs
        if (upgrade.cost) {
          if (this.money.lt(upgrade.cost)) {
            return;
          }
        }

        // subtract costs
        if (upgrade.cost) {
          this.$root.$emit('subtractMoney', upgrade.cost);
        }
      }

      // apply upgrade
      Object.keys(upgrade.efficiencyMultipliers).forEach((workerId) => {
        this.$root.$emit('multiplyEfficiency', { worker: workerId, amount: upgrade.efficiencyMultipliers[workerId] });
      });
      Object.keys(upgrade.productivityMultipliers).forEach((workerId) => {
        this.$root.$emit('multiplyProductivity', { worker: workerId, amount: upgrade.productivityMultipliers[workerId] });
      });

      // remove from upgrade list
      this.$root.$emit('removeUpgrade', upgrade.id);
    },
    orderedUpgrades(list) {
      return this.$options.filters.orderCost(list);
    },
    descriptionText(upgrade) {
      const effects = [];
      Object.keys(upgrade.productivityMultipliers).forEach((workerId) => {
        effects.push(`Multiplies ${this.workers[workerId].name} productivity by ${upgrade.productivityMultipliers[workerId]}x`);
      });
      Object.keys(upgrade.efficiencyMultipliers).forEach((workerId) => {
        effects.push(`Multiplies ${this.workers[workerId].name} efficiency by ${upgrade.efficiencyMultipliers[workerId]}x`);
      });
      return effects.join('<br>');
    },
    requirementsText(upgrade) {
      const requirements = [];
      Object.keys(upgrade.requirements).forEach((workerId) => {
        requirements.push(`Requires ${upgrade.requirements[workerId]} ${this.workers[workerId].pluralName}`);
      });
      return requirements.join('<br>');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
