<template>
  <div>
    <div>
      Words: {{ words | round }}
    </div>
    <div>
      Words per Second: {{ workerWps | round }}
    </div>
    <div v-if="debugMode">
      <div>
        Base $ per Second (DEBUG): {{ workerMps | moneyCents }}
      </div>
      <div>
        Base Word Value (DEBUG): {{ words.times(wordValue) | moneyCents }}
      </div>
    </div>
    <div>
      Money: {{ money | moneyCents }}
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

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
  computed: {
    ...mapState([
      'workerWps',
      'workerMps',
      'debugMode',
    ]),
    ...mapGetters([
      'wordValue',
    ]),
  },
};
</script>

<style lang="scss" scoped>

</style>
