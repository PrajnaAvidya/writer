<template>
  <div class="columns buttons">
    <div class="column">
      <a
        class="button is-primary is-large tooltip is-tooltip-right"
        :data-tooltip="tooltip"
        @click="$root.$emit('write')"
      >
        <i class="fas fa-pen fa-4x" />
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CreativeButtons',
  data: () => ({
    tooltip: 'Write some words',
  }),
  computed: {
    ...mapState([
      'playerWords',
      'buzzActive',
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
  methods: {
    writeTooltip() {
      if (this.buzzActive) {
        this.tooltip = `Write ${this.$options.filters.round(this.playerWords.times(2))} words`;
      } else if (this.playerWords.eq(1)) {
        this.tooltip = 'Write some words';
      } else {
        this.tooltip = `Write ${this.$options.filters.round(this.playerWords)} words`;
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
