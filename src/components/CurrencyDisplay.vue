<template>
  <div>
    <div class="is-size-3">
      Words: {{ words | round }}
    </div>
    <div class="is-size-6">
      Words per Second: {{ totalWps | round }}
    </div>
    <div v-if="debugMode">
      <div>
        Base $ per Second (DEBUG): {{ workerMps | moneyCents }}
      </div>
      <div>
        Base Word Value (DEBUG): {{ words.times(wordValue) | moneyCents }}
      </div>
    </div>
    <div class="is-size-4">
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
      'totalWps',
      'workerMps',
      'debugMode',
    ]),
    ...mapGetters([
      'wordValue',
    ]),
  },
};
</script>
