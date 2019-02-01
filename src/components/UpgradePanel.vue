<template>
  <div class="upgrades">
    <div
      v-for="upgrade in orderedUpgrades()"
      :key="upgrade.id"
      class="columns"
      :class="{ 'is-hidden': !revealedUpgrades[upgrade.id] && !canSeeUpgrade(upgrade) }"
    >
      <div class="column">
        <i
          v-if="upgrade.icon"
          class="fas fa-lg upgrade-icon"
          :class="upgrade.icon"
        />
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
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'UpgradePanel',
  computed: {
    ...mapState([
      'workers',
      'upgrades',
      'revealedUpgrades',
      'statistics',
      'playerIcons',
    ]),
    ...mapGetters([
      'money',
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
        if (upgrade.multipliers) {
          Object.keys(upgrade.multipliers).forEach((workerId) => {
            this.$root.$emit('multiplyProductivity', { worker: workerId, amount: upgrade.multipliers[workerId] });
          });
        }
      } else if (upgrade.type === 'clicking') {
        if (upgrade.writingMultiplier) {
          this.$root.$emit('multiplyClickingWords', upgrade.writingMultiplier);
          // upgrade icon
          const icon = this.playerIcons.pop();
          if (icon !== undefined) {
            this.updateData({ index: 'playerIcon', value: icon });
          }
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
        if (upgrade.wordMultiplier) {
          this.$root.$emit('multiplyCaffeineWords', upgrade.wordMultiplier);
        }
      } else if (upgrade.type === 'wordValue') {
        this.$root.$emit('multiplyWordValue', upgrade.multiplier);
      } else if (upgrade.type === 'jobs') {
        if (upgrade.cooldownMultiplier) {
          this.$root.$emit('multiplyJobCooldown', upgrade.cooldownMultiplier);
        }
        if (upgrade.rewardMultiplier) {
          this.$root.$emit('multiplyJobReward', upgrade.rewardMultiplier);
        }
      } else if (upgrade.type === 'urgentJobs') {
        if (upgrade.cooldownMultiplier) {
          this.$root.$emit('multiplyUrgentJobCooldown', upgrade.cooldownMultiplier);
        }
        if (upgrade.timerMultiplier) {
          this.$root.$emit('multiplyUrgentJobTimer', upgrade.timerMultiplier);
        }
        if (upgrade.rewardMultiplier) {
          this.$root.$emit('multiplyUrgentJobReward', upgrade.rewardMultiplier);
        }
      }

      // show message
      this.$root.$emit('notify', `Upgrade Purchased: ${upgrade.name}`);
    },
    orderedUpgrades() {
      return this.$options.filters.orderCost(this.upgrades);
    },
    descriptionText(upgrade) {
      const effects = [];
      if (upgrade.type === 'worker') {
        if (upgrade.multipliers) {
          Object.keys(upgrade.multipliers).forEach((workerId) => {
            effects.push(`Multiplies ${this.workers[workerId].name} productivity by ${upgrade.multipliers[workerId]}x`);
          });
        }
      } else {
        if (upgrade.type === 'wordValue') {
          effects.push(`Increases base word value (& job payments) by ${parseInt((upgrade.multiplier - 1) * 100, 10)}%`);
        }
        if (upgrade.writingMultiplier) {
          effects.push(`Increases writing clicks by ${parseInt((upgrade.writingMultiplier - 1) * 100, 10)}%`);
        }
        if (upgrade.cooldownReduction) {
          effects.push(`Subtracts ${upgrade.cooldownReduction} seconds from cooldown`);
        }
        if (upgrade.lengthMultiplier) {
          effects.push(`Increases duration by ${parseInt((upgrade.lengthMultiplier - 1) * 100, 10)}%`);
        }
        if (upgrade.powerMultiplier) {
          effects.push(`Increases effect by ${parseInt((upgrade.powerMultiplier - 1) * 100, 10)}%`);
        }
        if (upgrade.wordMultiplier) {
          effects.push(`Increases word generation by ${parseInt((upgrade.wordMultiplier - 1) * 100, 10)}%`);
        }
        if (upgrade.cooldownMultiplier) {
          effects.push(`Reduces cooldown by ${parseInt((1 - upgrade.cooldownMultiplier) * 100, 10)}%`);
        }
        if (upgrade.rewardMultiplier) {
          effects.push(`Increases reward by ${parseInt((upgrade.rewardMultiplier - 1) * 100, 10)}%`);
        }
        if (upgrade.timerMultiplier) {
          effects.push(`Increases timer by ${parseInt((upgrade.timerMultiplier - 1) * 100, 10)}%`);
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
          if (this.workers[workerId].quantity < required) {
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
          if (this.workers[workerId].quantity < required / 2) {
            metRequirements = false;
            return false;
          }
          return true;
        });
      } else if (upgrade.type === 'jobs') {
        return this.statistics.jobs.gte(5);
      } else if (upgrade.type === 'urgentJobs') {
        return this.statistics.urgentJobs.gte(3);
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
    ...mapMutations([
      'updateData',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.upgrade-icon {
  margin-right: 5px;
}
</style>
