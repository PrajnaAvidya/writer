<template>
  <div class="stats">
    <div class="status">
      Status: {{ status() }}
    </div>
    <div class="stat">
      Ideas: {{ ideas | roundPositive }}
    </div>
    <div
      class="stat"
      :style="{ textDecoration: jobActive ? 'line-through' : '' }"
    >
      Words: {{ words | round }}
    </div>
    <div
      class="stat"
      :style="{ textDecoration: jobActive ? 'line-through' : '' }"
    >
      Word Value: {{ wordValue | moneyCents }}
    </div>
    <div class="stat">
      Money: {{ money | moneyCents }}
    </div>
    <div class="stat">
      Reputation: {{ reputation | round }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatDisplay',
  props: {
    ideas: {
      type: Object,
      required: true,
    },
    words: {
      type: Object,
      required: true,
    },
    wordValue: {
      type: Object,
      required: true,
    },
    money: {
      type: Object,
      required: true,
    },
    reputation: {
      type: Object,
      required: true,
    },
    jobActive: Boolean,
  },
  methods: {
    status() {
      return 'high af';
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
