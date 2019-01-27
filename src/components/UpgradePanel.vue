<template>
  <div class="upgrades">
    <div
      v-for="upgrade in orderedUpgrades()"
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
import { mapState } from 'vuex';

export default {
  name: 'UpgradePanel',
  data: () => ({
    // TODO save to vuex
    revealedUpgrades: {},
  }),
  computed: {
    ...mapState([
      'money',
      'upgrades',
      'workers',
    ]),
  },
  methods: {
    buyUpgrade(upgrade) {
      // check requirements
      if (!this.canBuyUpgrade(upgrade)) {
        return;
      }

      // subtract cost
      if (upgrade.cost) {
        this.$root.$emit('subtractMoney', upgrade.cost);
      }

      // apply
      this.applyUpgrade(upgrade);

      // remove from list
      this.$root.$emit('removeUpgrade', upgrade.id);
    },
    applyUpgrade(upgrade) {
      if (upgrade.type === 'worker') {
        if (upgrade.productivityMultipliers) {
          Object.keys(upgrade.productivityMultipliers).forEach((workerId) => {
            this.$root.$emit('multiplyProductivity', { worker: workerId, amount: upgrade.productivityMultipliers[workerId] });
          });
        }
      } else if (upgrade.type === 'clicking') {
        if (upgrade.writingMultiplier) {
          this.$root.$emit('multiplyClickingWords', upgrade.writingMultiplier);
        }
      } else if (upgrade.type === 'caffeine') {
        if (upgrade.cooldownReduction) {
          this.$root.$emit('reduceCaffeineCooldown', upgrade.cooldownReduction);
        }
        if (upgrade.lengthMultiplier) {
          this.$root.$emit('multiplyCaffeineLength', upgrade.lengthMultiplier);
        }
        if (upgrade.powerMultiplier) {
          this.$root.$emit('multiplyCaffeinePower', upgrade.powerMultiplier);
        }
      } else if (upgrade.type === 'wordValue') {
        this.$root.$emit('multiplyWordValue', upgrade.multiplier);
      } else if (upgrade.type === 'jobs') {
        if (upgrade.cooldownReduction) {
          this.$root.$emit('reduceJobCooldown', upgrade.cooldownReduction);
        }
        if (upgrade.rewardMultiplier) {
          this.$root.$emit('multiplyJobReward', upgrade.rewardMultiplier);
        }
      }
    },
    orderedUpgrades() {
      return this.$options.filters.orderCost(this.upgrades);
    },
    descriptionText(upgrade) {
      const effects = [];
      if (upgrade.type === 'worker') {
        if (upgrade.productivityMultipliers) {
          Object.keys(upgrade.productivityMultipliers).forEach((workerId) => {
            effects.push(`Multiplies ${this.workers[workerId].name} productivity by ${upgrade.productivityMultipliers[workerId]}x`);
          });
        }
      } else if (upgrade.type === 'clicking') {
        if (upgrade.writingMultiplier) {
          effects.push(`Multiplies writing clicks by ${upgrade.writingMultiplier}`);
        }
      } else if (upgrade.type === 'caffeine') {
        if (upgrade.cooldownReduction) {
          effects.push(`Subtracts ${upgrade.cooldownReduction}s from caffeine cooldown`);
        }
        if (upgrade.lengthMultiplier) {
          effects.push(`Multiplies caffeine duration by ${upgrade.lengthMultiplier}`);
        }
        if (upgrade.powerMultiplier) {
          effects.push(`Multiplies caffeine effect by ${upgrade.powerMultiplier}`);
        }
      } else if (upgrade.type === 'wordValue') {
        effects.push(`Multiplies base word value by ${upgrade.multiplier}`);
      } else if (upgrade.type === 'jobs') {
        if (upgrade.cooldownReduction) {
          effects.push(`Reduces job cooldown by ${upgrade.cooldownReduction}`);
        }
        if (upgrade.rewardMultiplier) {
          effects.push(`Multiplies job reward by ${upgrade.rewardMultiplier}`);
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
      } else {
        // requirement is cost only
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
      } else {
        // requirement is cost only
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
      } else {
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
