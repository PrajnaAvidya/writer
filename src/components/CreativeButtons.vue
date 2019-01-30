<template>
  <div class="columns buttons">
    <div class="column">
      <a
        class="button is-primary is-large tooltip is-tooltip-right"
        :data-tooltip="writeTooltip()"
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
  computed: {
    ...mapState([
      'playerWords',
    ]),
  },
  methods: {
    writeTooltip() {
      if (this.playerWords.eq(1)) {
        return 'Write some words';
      }

      return `Write ${this.$options.filters.round(this.playerWords)} words`;
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
