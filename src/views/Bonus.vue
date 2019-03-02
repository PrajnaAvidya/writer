<template>
  <div>
    <div class="bonus-title is-size-3">
      Plot Points: {{ plotPoints | round }}
    </div>
    <p class="text">
      You are currently receiving a <strong>{{ plotPoints.times(2) | round }}% bonus to clicks, caffeine, and workers.</strong> You may spend some of your plot points on the following abilities:
    </p>
    <div class="bonuses">
      <div
        v-for="bonus in lockedBonuses"
        :key="bonus.id"
        class="columns bonus"
        :class="{ 'is-hidden': !canSeeBonus(bonus) }"
      >
        <div class="bonus-name">
          {{ bonus.name }}
        </div>
        <div class="bonus-description">
          {{ bonus.description }}
        </div>
        <div class="bonus-button">
          <a
            :disabled="plotPoints.lt(bonus.cost)"
            class="button is-warning"
            @click="buyBonus(bonus)"
          >
            {{ bonus.cost | round }} Plot Points
          </a>
        </div>
      </div>

      <div class="columns bonus">
        <div class="bonus-name">
          Rebirth Milestone Reduction
        </div>
        <div class="bonus-description">
          Reduce the number of milestones required for rebirth by 10 (can be purchased unlimited times)
        </div>
        <div class="bonus-button">
          <a
            :disabled="plotPoints.lt(150)"
            class="button is-warning"
            @click="buyMilestoneReduction()"
          >
            150 Plot Points
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import notify from '@/utils/notify';

export default {
  name: 'Bonus',
  computed: {
    ...mapState('rebirth', [
      'plotPoints',
      'lockedBonuses',
      'purchasedBonuses',
    ]),
  },
  methods: {
    canSeeBonus(bonus) {
      // check for previous id
      if (bonus.previousId && !this.purchasedBonuses.includes(bonus.previousId)) {
        return false;
      }

      return true;
    },
    buyBonus(bonus) {
      if (this.plotPoints.lt(bonus.cost)) {
        return;
      }

      this.spendPlotPoints(bonus.cost);

      // apply bonus
      if (bonus.type === 'jobSlot') {
        this.addJobSlot();
      } else if (bonus.type === 'hurryAmount') {
        this.multiplyBonus({ index: 'hurryAmount', amount: 2 });
      } else if (bonus.type === 'caffeineWordMultiplier') {
        this.multiplyBonus({ index: 'caffeineWordMultiplier', amount: 2 });
      } else if (bonus.type === 'passiveMoney') {
        this.passiveMoney();
      } else if (bonus.type === 'rebirthMoney') {
        this.setRebirthMoney(bonus.amount);
      } else if (bonus.type === 'jobWords') {
        this.multiplyBonus({ index: 'jobWordMultiplier', amount: 0.8 });
      }

      notify(`Bonus Acquired: ${bonus.name}!`, { type: 'alert', icon: 'fa-thumbs-up' });

      this.purchasedBonuses.push(bonus.id);

      this.removeBonus(bonus.id);

      this.$root.$emit('updateWps');

      this.$ga.event({
        eventCategory: 'Bonus',
        eventAction: 'Bought',
        eventLabel: `${bonus.name}`,
      });
    },
    buyMilestoneReduction() {
      if (this.plotPoints.lt(150)) {
        return;
      }

      this.spendPlotPoints(150);

      this.addRebirthData({ index: 'baseMilestonesNeeded', amount: -10 });
    },
    ...mapMutations('rebirth', [
      'removeBonus',
      'spendPlotPoints',
      'addJobSlot',
      'passiveMoney',
      'addBonus',
      'multiplyBonus',
      'multiplyRebirthData',
      'setRebirthMoney',
      'addRebirthData',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.bonus-title {
  font-weight: bolder;
}
.bonuses {
  height: 465px;
  overflow-x: hidden;
  overflow-y: auto;
}
.bonus {
  margin-top: 15px;
}
.bonus-name {
  width: 200px;
}
.bonus-description {
  width: 550px;
}
.bonus-button {
  width: 150px;
}
</style>
