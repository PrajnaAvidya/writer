<template>
  <div>
    <div>
      Words: {{ words | round }}
    </div>
    <div>
      Money: {{ money | moneyCents }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CurrencyDisplay',
  props: {
    words: {
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
