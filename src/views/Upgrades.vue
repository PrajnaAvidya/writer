<template>
  <div class="upgrades">
    <a
      v-if="checkBonus('buyAllUpgrades')"
      class="button buy-all"
      @click="buyAll"
    >
      <strong>Buy All</strong>
    </a>
    <div
      v-for="upgrade in orderedUpgrades()"
      :key="upgrade.id"
      class="columns"
      :class="{'is-hidden': !checkDebug('showAllUpgrades') && !upgrade.revealed}"
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
import infiniteUpgrade from '@/data/upgrades/infinite';
import notify from '@/utils/notify';

export default {
  name: 'UpgradePanel',
  computed: {
    ...mapState('icons', [
      'playerIcons',
    ]),
    ...mapState('upgrades', [
      'upgrades',
      'purchasedUpgrades',
      'upgradeId',
    ]),
    ...mapState('statistics', [
      'stats',
    ]),
    ...mapState('currency', [
      'money',
      'wordValue',
    ]),
    ...mapState('jobs', [
      'urgentJobTimestamp',
    ]),
    ...mapState('workers', [
      'workers',
    ]),
    ...mapGetters('debug', [
      'checkDebug',
    ]),
    ...mapGetters('rebirth', [
      'checkBonus',
    ]),
  },
  methods: {
    buyUpgrade(upgrade, bulk = false) {
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

      // show message
      if (!bulk) {
        notify(`Upgrade Purchased: ${upgrade.name}`, { icon: 'fa-angle-double-up' });
      }

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
        this.upgrades[this.upgradeId] = infiniteUpgrade(this.upgradeId, upgrade.type, upgrade);
      }
    },
    buyAll() {
      let bought = 0;
      this.orderedUpgrades().forEach((upgrade) => {
        if (upgrade.revealed) {
          if (this.canBuyUpgrade(upgrade)) {
            this.buyUpgrade(upgrade, true);
            bought += 1;
          }
        }
      });
      if (bought > 0) {
        notify(`Purchased ${bought} Upgrades`, { icon: 'fa-expand-arrows-alt' });
      }
    },
    applyUpgrade(upgrade) {
      if (upgrade.type === 'worker') {
        if (upgrade.multipliers) {
          Object.keys(upgrade.multipliers).forEach((workerId) => {
            this.workers[workerId].productivityMultiplier = this.workers[workerId].productivityMultiplier.times(upgrade.multipliers[workerId]);
          });
        }
      } else if (upgrade.type === 'caffeine') {
        if (upgrade.cooldownReduction) {
          this.adjustCaffeineTimer(-upgrade.cooldownReduction);
        }
        if (upgrade.lengthMultiplier) {
          this.multiplyCaffeineData({ index: 'caffeineTime', amount: upgrade.lengthMultiplier });
        }
      } else if (upgrade.type === 'wordValue') {
        this.multiplyCurrencyData({ index: 'wordValue', amount: upgrade.multiplier });
      } else if (upgrade.type === 'jobReward') {
        this.multiplyJobData({ index: 'jobRewardMultiplier', amount: upgrade.multiplier });
      } else if (upgrade.type === 'urgentJobReward') {
        this.multiplyJobData({ index: 'urgentJobRewardMultiplier', amount: upgrade.multiplier });
      } else if (upgrade.type === 'jobCooldown') {
        this.adjustJobTimer(-upgrade.cooldownReduction);
      } else if (upgrade.type === 'urgentJobCooldown') {
        this.multiplyJobData({ index: 'urgentJobMinimumTime', amount: upgrade.cooldownMultiplier });
        this.multiplyJobData({ index: 'urgentJobMaximumTime', amount: upgrade.cooldownMultiplier });
      }
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
      } else if (upgrade.type === 'wordValue') {
        effects.push(`Increases base word value (& job payments) by ${parseInt((upgrade.multiplier - 1) * 100, 10)}%`);
      } else if (upgrade.type === 'jobReward') {
        effects.push(`Increases job payments by ${parseInt((upgrade.multiplier - 1) * 100, 10)}%`);
      } else if (upgrade.type === 'urgentJobReward') {
        effects.push(`Increases urgent job payments by ${parseInt((upgrade.multiplier - 1) * 100, 10)}%`);
      } else if (upgrade.type === 'clicking') {
        effects.push(`Increases writing clicks by ${parseInt((upgrade.writingMultiplier - 1) * 100, 10)}%`);
      } else {
        if (upgrade.cooldownReduction) {
          effects.push(`Subtracts ${upgrade.cooldownReduction} seconds from cooldown`);
        }
        if (upgrade.lengthMultiplier) {
          effects.push(`Increases duration by ${parseInt((upgrade.lengthMultiplier - 1) * 100, 10)}%`);
        }
        if (upgrade.cooldownMultiplier) {
          effects.push(`Reduces cooldown by ${parseInt((1 - upgrade.cooldownMultiplier) * 100, 10)}%`);
        }
      }

      return effects.join('<br>');
    },
    requirementsText(upgrade) {
      const requirements = [];
      if (upgrade.type === 'worker') {
        Object.keys(upgrade.requirements).forEach((workerId) => {
          if (this.workers[workerId].quantity < upgrade.requirements[workerId]) {
            requirements.push(`Requires ${this.$options.filters.round(upgrade.requirements[workerId])} ${this.workers[workerId].pluralName}`);
          }
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
    ...mapMutations('icons', [
      'setIconData',
    ]),
    ...mapMutations('upgrades', [
      'incrementUpgradeId',
    ]),
    ...mapMutations('currency', [
      'multiplyCurrencyData',
    ]),
    ...mapMutations('caffeine', [
      'adjustCaffeineTimer',
      'multiplyCaffeineData',
    ]),
    ...mapMutations('jobs', [
      'adjustJobTimer',
      'setJobsData',
      'multiplyJobData',
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
.buy-all {
  background-color: $greenish;
  margin-bottom: 10px;
}
</style>
