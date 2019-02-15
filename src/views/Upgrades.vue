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
      'revealedUpgrades',
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
        this.upgrades[this.upgradeId] = infiniteUpgrade(this.upgradeId, upgrade.type, upgrade);
      }
    },
    applyUpgrade(upgrade) {
      if (upgrade.type === 'worker') {
        if (upgrade.multipliers) {
          Object.keys(upgrade.multipliers).forEach((workerId) => {
            this.workers[workerId].productivityMultiplier = this.workers[workerId].productivityMultiplier.times(upgrade.multipliers[workerId]);
          });
        }
      } else if (upgrade.type === 'clicking') {
        this.multiplyCurrencyData({ index: 'playerWords', amount: upgrade.writingMultiplier });
        // upgrade icon
        const icon = this.playerIcons.pop();
        if (icon) {
          this.setIconData({ index: 'playerIcon', value: icon });
        }
      } else if (upgrade.type === 'caffeine') {
        if (upgrade.cooldownReduction) {
          this.adjustCaffeineTimer(-upgrade.cooldownReduction);
        }
        if (upgrade.lengthMultiplier) {
          this.multiplyCaffeineData({ index: 'caffeineTime', amount: upgrade.lengthMultiplier });
        }
      } else if (upgrade.type === 'caffeinePower') {
        this.multiplyCaffeineData({ index: 'caffeineClickMultiplier', amount: upgrade.multiplier });
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
      } else if (upgrade.type === 'wordValue') {
        effects.push(`Increases base word value (& job payments) by ${parseInt((upgrade.multiplier - 1) * 100, 10)}%`);
      } else if (upgrade.type === 'caffeinePower') {
        effects.push(`Increases caffeine click power by ${parseInt((upgrade.multiplier - 1) * 100, 10)}%`);
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
    canSeeUpgrade(upgrade) {
      if (this.checkDebug('showAllUpgrades')) {
        return true;
      }
      // check for previous id
      if (upgrade.previousId && !this.purchasedUpgrades.includes(upgrade.previousId)) {
        return false;
      }

      let metRequirements = true;
      if (upgrade.type === 'jobs') {
        metRequirements = this.stats.jobs.gte(1);
      } else if (upgrade.type === 'urgentJobs') {
        metRequirements = this.stats.urgentJobs.gte(1);
      } else {
        // show upgrade when player has 10% money
        metRequirements = this.money.gte(upgrade.cost.div(10));
      }
      if (!metRequirements) {
        return false;
      }

      // upgrades can always been seen once revealed
      this.revealedUpgrades[upgrade.id] = true;
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
.upgrades {
  height: 465px;
  overflow-x: hidden;
  overflow-y: auto;
}
.upgrade-icon {
  margin-right: 5px;
}
.buy-upgrade {
  font-size: 14pt;
  padding: 20px 15px;
  background-color: $greenish;
}
</style>
