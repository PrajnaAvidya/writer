<template>
  <div>
    <div class="bonus-title is-size-3">
      Plot Points: {{ rebirth.plotPoints | round }}
    </div>
    <p>
      You are currently receiving a <strong>{{ rebirth.plotPoints | round }}% bonus to clicks, caffeine, and workers.</strong> You may spend some of your plot points on the following abilities:
    </p>
    <div class="bonuses">
      <div
        v-for="bonus in rebirth.lockedBonuses"
        :key="bonus.id"
        class="columns bonus"
      >
        <div class="column">
          {{ bonus.name }}
        </div>
        <div class="column">
          {{ bonus.description }}
        </div>
        <div class="column">
          <a
            :disabled="rebirth.plotPoints.lt(bonus.cost)"
            class="button is-warning"
            @click="buyBonus(bonus)"
          >
            {{ bonus.cost | round }} Plot Points
          </a>
        </div>
      </div>
    </div>

    <div class="columns bonus">
      <div class="column">
        <i>More bonuses coming in the next alpha!</i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Bonus',
  computed: {
    ...mapState('game', [
      'rebirth',
    ]),
  },
  methods: {
    buyBonus(bonus) {
      if (this.rebirth.plotPoints.lt(bonus.cost)) {
        return;
      }

      this.spendPlotPoints(bonus.cost);

      // apply bonus
      if (bonus.jobSlot) {
        this.addJobSlot();
      } else if (bonus.hurryAmount) {
        this.increaseHurryAmount();
      } else if (bonus.caffeine) {
        this.enableWorkerCaffeine(bonus.caffeine);
      }

      this.removeBonus(bonus.id);

      this.$root.$emit('updateWpsMps');

      this.$ga.event({
        eventCategory: 'Bonus',
        eventAction: 'Bought',
        eventLabel: `${bonus.name}`,
      });
    },
    ...mapMutations('game', [
      'removeBonus',
      'spendPlotPoints',
      'addJobSlot',
      'increaseHurryAmount',
      'enableWorkerCaffeine',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.bonus-title {
  margin: 10px;
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
