<template>
  <div class="stats">
    <div class="stat">
      Words: {{ words | round }}
    </div>
    <div class="stat">
      Word Value: {{ wordValue | moneyCents }}
    </div>
    <div class="stat">
      Money: {{ money | moneyCents }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatDisplay',
  props: {
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
  },
};
</script>

<style lang="scss" scoped>

</style>
