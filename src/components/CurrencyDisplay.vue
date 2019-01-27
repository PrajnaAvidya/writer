<template>
  <div>
    <div>
      Words: {{ words | round }}
    </div>
    <div>
      Words per Second: {{ workerWps | round }}
    </div>
    <div>
      Base $ per Second (DEBUG): {{ workerMps | moneyCents }}
    </div>
    <div>
      Base Word Value (DEBUG): {{ words.times(wordValue) | moneyCents }}
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
  computed: {
    ...mapState([
      'workerWps',
      'workerMps',
    ]),
    ...mapGetters([
      'words',
      'money',
      'wordValue',
    ]),
  },
};
</script>

<style lang="scss" scoped>

</style>
