<template>
  <div
    v-if="buttonSize > 0"
    class="columns buttons"
  >
    <div class="column">
      <a
        class="button is-primary is-large tooltip is-tooltip-right"
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
      'caffeineMinimumWordGeneration',
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
  mounted() {
    this.writeTooltip();
  },
  methods: {
    writeTooltip() {
      let words = this.playerWords.times(this.plotBonus);
      if (this.buzzActive) {
        words = words.plus(this.workerWps.plus(this.caffeineMinimumWordGeneration.div(2)));
      }

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
