<template>
  <div class="columns buttons">
    <div class="column">
      <a
        class="button is-primary is-large tooltip is-tooltip-right"
        :class="{ pulse: buzzActive }"
        :data-tooltip="tooltip"
        @click="$root.$emit('write', $event)"
      >
        <i
          class="fas fa-4x"
          :class="playerIcon"
        />
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Big from 'big.js';

export default {
  name: 'CreativeButtons',
  data: () => ({
    tooltip: 'Write some words',
  }),
  computed: {
    ...mapState('icons', [
      'playerIcon',
    ]),
    ...mapState('currency', [
      'playerWords',
    ]),
    ...mapState('caffeine', [
      'buzzActive',
      'caffeineClickMultiplier',
    ]),
    ...mapState('rebirth', [
      'plotPoints',
      'bonuses',
    ]),
    ...mapState('workers', [
      'workerWps',
    ]),
  },
  watch: {
    playerWords() {
      this.writeTooltip();
    },
    buzzActive() {
      this.writeTooltip();
    },
  },
  mounted() {
    this.writeTooltip();
  },
  methods: {
    writeTooltip() {
      let words = this.playerWords;
      if (this.buzzActive) {
        words = words.times(this.caffeineClickMultiplier).plus(this.bonuses.caffeineClickWps.times(this.workerWps));
      }
      // add plot bonus
      words = words.times(Big(1).plus(this.plotPoints.div(100)));
      console.log(words.toString());

      if (words.eq(1)) {
        this.tooltip = 'Write a word';
      } else {
        this.tooltip = `Write ${this.$options.filters.round(words)} words`;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.button {
  height: 150px;
  width: 150px;
}
.buttons {
  margin: 0 auto;
  width: 200px;
}
</style>
