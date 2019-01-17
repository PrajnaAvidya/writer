<template>
  <div class="stats">
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
    ideas: Big,
    words: Big,
    money: Big,
    reputation: Big,
    jobActive: Boolean,
  },
};
</script>
