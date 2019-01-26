<template>
  <div class="columns buttons">
    <div class="column">
      <a
        class="button is-primary is-large tooltip is-tooltip-left"
        :data-tooltip="thinkTooltip()"
        @click="$root.$emit('think')"
      >
        <i class="fas fa-brain fa-lg" />
      </a>
    </div>

    <div class="column">
      <a
        class="button is-primary is-large tooltip is-tooltip-right"
        :data-tooltip="writeTooltip()"
        @click="$root.$emit('write')"
      >
        <i class="fas fa-pen fa-lg" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreativeButtons',
  props: {
    playerIdeas: {
      type: Object,
      required: true,
    },
    playerWords: {
      type: Object,
      required: true,
    },
  },
  methods: {
    thinkTooltip() {
      if (this.playerIdeas.eq(1)) {
        return 'Think of ideas';
      }

      return `Think of ${this.$options.filters.round(this.playerIdeas)} ideas`;
    },
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
.buttons {
  margin: 0 auto;
  width: 200px;
}
</style>
