<template>
  <div
    class="upgrades"
    :hidden="!showUpgrades"
  >
    <div
      v-for="upgrade in orderedUpgrades(upgrades)"
      :key="upgrade.id"
      class="columns"
      :class="{ 'is-hidden': !revealedUpgrades[upgrade.id] && !canSeeUpgrade(upgrade) }"
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
          :disabled="!canBuyUpgrade(upgrade)"
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
  data: () => ({
    // TODO save to vuex
    revealedUpgrades: {},
  }),
  mounted() {
    // console.log(this.upgrades);
  },
  methods: {
    buyUpgrade(upgrade) {
      // check requirements
      if (!this.canBuyUpgrade(upgrade)) {
        return;
      }

      // subtract costs
      if (upgrade.cost) {
        this.$root.$emit('subtractMoney', upgrade.cost);
      }

      // apply multipliers
      if (upgrade.type === 'worker') {
        if (upgrade.productivityMultipliers) {
          Object.keys(upgrade.productivityMultipliers).forEach((workerId) => {
            this.$root.$emit('multiplyProductivity', { worker: workerId, amount: upgrade.productivityMultipliers[workerId] });
          });
        }
        if (upgrade.efficiencyMultipliers) {
          Object.keys(upgrade.efficiencyMultipliers).forEach((workerId) => {
            this.$root.$emit('multiplyEfficiency', { worker: workerId, amount: upgrade.efficiencyMultipliers[workerId] });
          });
        }
      } else if (upgrade.type === 'clicking') {
        if (upgrade.clickingIdeaMultiplier) {
          this.$root.$emit('multiplyClickingIdeas', upgrade.clickingIdeaMultiplier);
        }
        if (upgrade.clickingWritingMultiplier) {
          this.$root.$emit('multiplyClickingWords', upgrade.clickingWritingMultiplier);
        }
        if (upgrade.clickingMaxWritingMultiplier) {
          this.$root.$emit('multiplyClickingMaxWords', upgrade.clickingMaxWritingMultiplier);
        }
      } else if (upgrade.type === 'caffeine') {
        if (upgrade.caffeineMaxLengthAdder) {
          this.$root.$emit('addCaffeineMaxLength', upgrade.caffeineMaxLengthAdder);
        }
        if (upgrade.caffeineLengthMultiplier) {
          this.$root.$emit('multiplyCaffeineLength', upgrade.caffeineLengthMultiplier);
        }
        if (upgrade.caffeinePowerMultiplier) {
          this.$root.$emit('multiplyCaffeinePower', upgrade.caffeinePowerMultiplier);
        }
      }

      // remove from upgrade list
      this.$root.$emit('removeUpgrade', upgrade.id);
    },
    orderedUpgrades(list) {
      return this.$options.filters.orderCost(list);
    },
    descriptionText(upgrade) {
      const effects = [];
      if (upgrade.type === 'worker') {
        if (upgrade.productivityMultipliers) {
          Object.keys(upgrade.productivityMultipliers).forEach((workerId) => {
            effects.push(`Multiplies ${this.workers[workerId].name} productivity by ${upgrade.productivityMultipliers[workerId]}x`);
          });
        }
        if (upgrade.efficiencyMultipliers) {
          Object.keys(upgrade.efficiencyMultipliers).forEach((workerId) => {
            effects.push(`Multiplies ${this.workers[workerId].name} efficiency by ${upgrade.efficiencyMultipliers[workerId]}x`);
          });
        }
      } else if (upgrade.type === 'clicking') {
        if (upgrade.clickingIdeaMultiplier) {
          effects.push(`Multiplies idea clicks by ${upgrade.clickingIdeaMultiplier}`);
        }
        if (upgrade.clickingWritingMultiplier) {
          effects.push(`Multiplies writing clicks by ${upgrade.clickingWritingMultiplier}`);
        }
        if (upgrade.clickingMaxWritingMultiplier) {
          effects.push(`Multiplies writing max clicks by ${upgrade.clickingMaxWritingMultiplier}`);
        }
      } else if (upgrade.type === 'caffeine') {
        if (upgrade.caffeineMaxLengthAdder) {
          effects.push(`Adds ${upgrade.caffeineMaxLengthAdder}s to caffeine max length`);
        }
        if (upgrade.caffeineLengthMultiplier) {
          effects.push(`Multiplies caffeine duration by ${upgrade.caffeineLengthMultiplier}`);
        }
        if (upgrade.caffeinePowerMultiplier) {
          effects.push(`Multiplies caffeine effect by ${upgrade.caffeinePowerMultiplier}`);
        }
      }

      return effects.join('<br>');
    },
    requirementsText(upgrade) {
      const requirements = [];
      if (upgrade.type === 'worker') {
        Object.keys(upgrade.requirements).forEach((workerId) => {
          requirements.push(`Requires ${this.$options.filters.round(upgrade.requirements[workerId])} ${this.workers[workerId].pluralName}`);
        });
      } else if (upgrade.type === 'clicking' || upgrade.type === 'caffeine') {
        // requirement is money only
      }

      return requirements.join('<br>');
    },
    canBuyUpgrade(upgrade) {
      if (this.money.lt(upgrade.cost)) {
        return false;
      }

      let metRequirements = true;

      if (upgrade.type === 'worker') {
        metRequirements = Object.keys(upgrade.requirements).every((workerId) => {
          const required = upgrade.requirements[workerId];
          if (this.workers[workerId].quantity.lt(required)) {
            metRequirements = false;
            return false;
          }
          return true;
        });
      } else if (upgrade.type === 'clicking' || upgrade.type === 'caffeine') {
        // clicking upgrades just require money
      }
      if (!metRequirements) {
        return false;
      }

      return true;
    },
    canSeeUpgrade(upgrade) {
      let metRequirements = true;

      if (upgrade.type === 'worker') {
        // show upgrade when player has 1/2 workers
        metRequirements = Object.keys(upgrade.requirements).every((workerId) => {
          const required = upgrade.requirements[workerId];
          if (this.workers[workerId].quantity.lt(required.div(2))) {
            metRequirements = false;
            return false;
          }
          return true;
        });
      } else if (upgrade.type === 'clicking' || upgrade.type === 'caffeine') {
        // show upgrade when player has 1/2 money
        metRequirements = this.money.gte(upgrade.cost.div(2));
      }
      if (!metRequirements) {
        return false;
      }

      this.revealedUpgrades[upgrade.id] = true;
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
