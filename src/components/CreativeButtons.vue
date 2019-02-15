<template>
  <div class="columns buttons">
    <div class="column">
      <a
        class="button is-primary is-large tooltip is-tooltip-right"
        :class="{ pulse: buzzActive }"
        :style="{ width: buttonSizePx, height: buttonSizePx }"
        :data-tooltip="tooltip"
        @click="$root.$emit('write', $event)"
      >
        <i
          class="fas"
          :class="iconClass"
        />
      </a>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Big from 'big.js';
import buttonSizes from '@/data/buttonSizes';

export default {
  name: 'CreativeButtons',
  data: () => ({
    tooltip: 'Write some words',
  }),
  computed: {
    buttonSizePx() {
      return `${buttonSizes[this.buttonSize].size}px`;
    },
    iconClass() {
      const iconClasses = {};
      iconClasses[`fa-${buttonSizes[this.buttonSize].icon}`] = true;
      iconClasses['fa-bolt'] = this.buzzActive;
      iconClasses[this.playerIcon] = !this.buzzActive;

      return iconClasses;
    },
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
    ...mapState('options', [
      'buttonSize',
    ]),
    ...mapGetters('rebirth', [
      'plotBonus',
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
      words = words.times(this.plotBonus);

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
.buttons {
  margin: 0 auto;
  width: 200px;
}
</style>
