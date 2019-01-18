<template>
  <div class="stats">
    <div class="status">
      Status: {{ status() }}
    </div>
    <div class="ideas">
      Ideas: {{ ideas | roundPositive }}
    </div>
    <div
      class="words"
      :style="{ textDecoration: jobActive ? 'line-through' : '' }"
    >
      Words: {{ words | round }}
    </div>
    <div class="money">
      Money: {{ money | money }}
    </div>
    <div class="reputation">
      Reputation: {{ reputation | round }}
    </div>
  </div>
</template>

<script>
import Big from 'big.js';

export default {
  name: 'StatDisplay',
  props: {
    ideas: {
      type: Big,
      required: true,
    },
    words: {
      type: Big,
      required: true,
    },
    money: {
      type: Big,
      required: true,
    },
    reputation: {
      type: Big,
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
