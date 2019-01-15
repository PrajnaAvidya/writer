<template>
  <div class="stats">
    <div class="ideas">Ideas: {{ ideas | roundPositive }}</div>
    <div class="words">Words: {{ words | round }}</div>
    <div class="money">Money: {{ money | money }}</div>
  </div>
</template>

<script>
import Big from 'big.js';

export default {
  name: 'stat-display',
  props: {
    ideas: Big,
    words: Big,
    money: Big,
  },
};
</script>

<style lang="scss" scoped>

</style>
