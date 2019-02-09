<template>
  <div>
    <div class="bonus-title is-size-3">
      Plot Points: {{ plotPoints | round }}
    </div>
    <p class="text">
      You are currently receiving a <strong>{{ plotPoints | round }}% bonus to clicks, caffeine, and workers.</strong> You may spend some of your plot points on the following abilities:
    </p>
    <div class="bonuses">
      <div
        v-for="bonus in lockedBonuses"
        :key="bonus.id"
        class="columns bonus"
        :class="{ 'is-hidden': !canSeeBonus(bonus) }"
      >
        <div class="column">
          {{ bonus.name }}
        </div>
        <div class="column">
          {{ bonus.description }}
        </div>
        <div class="column">
          <a
            :disabled="plotPoints.lt(bonus.cost)"
            class="button is-warning"
            @click="buyBonus(bonus)"
          >
            {{ bonus.cost | round }} Plot Points
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
      if (bonus.caffeine) {
        this.enableWorkerCaffeine(bonus.caffeine);
      } else if (bonus.type === 'jobSlot') {
        this.addJobSlot();
      } else if (bonus.type === 'hurryAmount') {
        this.multiplyBonus({ index: 'hurryAmount', amount: 2 });
      } else if (bonus.type === 'caffeineWordMultiplier') {
        this.multiplyBonus({ index: 'caffeineWordMultiplier', amount: 2 });
      } else if (bonus.type === 'caffeineClickWps') {
        this.addBonus({ index: 'caffeineClickWps', amount: 1 });
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
    ...mapMutations('rebirth', [
      'enableWorkerCaffeine',
      'removeBonus',
      'spendPlotPoints',
      'addJobSlot',
      'addBonus',
      'multiplyBonus',
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
</style>
