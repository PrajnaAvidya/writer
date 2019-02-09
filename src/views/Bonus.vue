<template>
  <div>
    <div class="bonus-title is-size-3">
      Plot Points: {{ rebirth.plotPoints | round }}
    </div>
    <p>
      You are currently receiving a <strong>{{ rebirth.plotPoints | round }}% bonus to clicks, caffeine, and workers.</strong> You may spend some of your plot points on the following abilities:
    </p>
    <div
      v-for="bonus in rebirth.lockedBonuses"
      :key="bonus.name"
      class="columns upgrade"
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

    <div class="columns upgrade">
      <div class="column">
        More bonus abilities coming
      </div>
      <div class="column">
        in the next alpha!
      </div>
      <div class="column">
        &nbsp;
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Bonus',
  computed: {
    ...mapState([
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
      }

      this.removeBonus(bonus.id);

      this.$root.$emit('updateWpsMps');
    },
    ...mapMutations([
      'removeBonus',
      'spendPlotPoints',
      'addJobSlot',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.bonus-title {
  margin: 10px;
}
.upgrade {
  margin-top: 15px;
}
</style>
