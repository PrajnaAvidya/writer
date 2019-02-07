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
          class="button buy-upgrade"
          @click="buyUpgrade(upgrade)"
        >
          <strong>
            {{ upgrade.cost | money }}
          </strong>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import infiniteUpgrade from '@/utils/infiniteUpgrade';
import notify from '@/utils/notify';

export default {
  name: 'UpgradePanel',
  computed: {
    ...mapState([
      'debug',
      'currency',
      'workers',
      'upgrades',
      'revealedUpgrades',
      'purchasedUpgrades',
      'statistics',
      'playerIcons',
      'urgentJobTimestamp',
      'upgradeId',
      'adjectives',
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

      // buy
      if (upgrade.cost) {
        this.$root.$emit('subtractMoney', upgrade.cost);
      }
      this.purchasedUpgrades.push(upgrade.id);

      // apply
      this.applyUpgrade(upgrade);

      this.$ga.event({
        eventCategory: 'Upgrade',
        eventAction: 'Bought',
        eventLabel: `${upgrade.name} ${upgrade.cost.toString()}`,
      });

      // remove from list
      this.$root.$emit('removeUpgrade', upgrade.id);

      // generate next upgrade if infinite upgrade
      if (upgrade.infinite) {
        this.incrementUpgradeId();
        this.upgrades[this.upgradeId] = infiniteUpgrade(this.upgradeId, upgrade.type, this.adjectives, upgrade);
      }
    },
    applyUpgrade(upgrade) {
      if (upgrade.type === 'worker') {
        if (upgrade.multipliers) {
          Object.keys(upgrade.multipliers).forEach((workerId) => {
            this.workers[workerId].productivityMultiplier = this.workers[workerId].productivityMultiplier.times(upgrade.multipliers[workerId]);
            this.$root.$emit('updateWpsMps');
          });
        }
      } else if (upgrade.type === 'clicking') {
        if (upgrade.writingMultiplier) {
          this.multiplyData({ index: 'playerWords', amount: upgrade.writingMultiplier });
          // upgrade icon
          const icon = this.playerIcons.pop();
          if (icon !== undefined) {
            this.updateData({ index: 'playerIcon', value: icon });
          }
        }
      } else if (upgrade.type === 'caffeine') {
        if (upgrade.cooldownReduction) {
          this.adjustCaffeineTimer(-upgrade.cooldownReduction);
        }
        if (upgrade.lengthMultiplier) {
          this.multiplyData({ index: 'caffeineTime', amount: upgrade.lengthMultiplier });
        }
        if (upgrade.powerMultiplier) {
          this.multiplyData({ index: 'caffeineClickMultiplier', amount: upgrade.powerMultiplier });
        }
        if (upgrade.wordMultiplier) {
          this.multiplyData({ index: 'caffeineWordGeneration', amount: upgrade.wordMultiplier });
        }
      } else if (upgrade.type === 'wordValue') {
        this.currency.wordValue = this.currency.wordValue.times(upgrade.multiplier);
        this.$root.$emit('updateWpsMps');
      } else if (upgrade.type === 'jobs') {
        if (upgrade.cooldownReduction) {
          this.adjustJobTimer(-upgrade.cooldownReduction);
        }
        if (upgrade.rewardMultiplier) {
          this.multiplyData({ index: 'jobRewardMultiplier', amount: upgrade.rewardMultiplier });
        }
      } else if (upgrade.type === 'urgentJobs') {
        if (upgrade.cooldownMultiplier) {
          this.multiplyData({ index: 'urgentJobMinimumTime', amount: upgrade.cooldownMultiplier });
          this.multiplyData({ index: 'urgentJobMaximumTime', amount: upgrade.cooldownMultiplier });
        }
        if (upgrade.timerMultiplier) {
          this.multiplyData({ index: 'urgentJobTimer', amount: upgrade.timerMultiplier });
          this.updateData({ index: 'urgentJobExpiration', value: this.urgentJobTimestamp + (1000 * upgrade.timerMultiplier) });
        }
        if (upgrade.rewardMultiplier) {
          this.multiplyData({ index: 'urgentJobRewardMultiplier', amount: upgrade.rewardMultiplier });
        }
      }

      // show message
      notify(`Upgrade Purchased: ${upgrade.name}`, { icon: 'fa-angle-double-up' });
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
      // check for debug
      if (this.debug.enabled) {
        return true;
      }
      // check for previous id
      if (upgrade.previousId && !this.purchasedUpgrades.includes(upgrade.previousId)) {
        return false;
      }

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

      // upgrades can always been seen once revealed
      this.revealedUpgrades[upgrade.id] = true;
      return true;
    },
    ...mapMutations([
      'updateData',
      'multiplyData',
      'adjustCaffeineTimer',
      'adjustJobTimer',
      'incrementUpgradeId',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.upgrade-icon {
  margin-right: 5px;
}
.buy-upgrade {
  font-size: 14pt;
  padding: 20px 15px;
  background-color: $greenish;
}
</style>
