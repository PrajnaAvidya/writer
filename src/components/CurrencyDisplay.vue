<template>
  <div>
    <Transition name="fade">
      <div class="is-size-3">
        Words: {{ words | round }}
      </div>
    </Transition>
    <div
      v-if="checkDebug('disableUnfolding') || unfolding.showWps"
      class="is-size-6"
    >
      Words per Second: {{ totalWps | round }}
    </div>
    <div v-if="checkDebug('enabled')">
      <div>
        Base $ per Second (DEBUG): {{ totalMps | moneyCents }}
      </div>
      <div>
        Base Word Value (DEBUG): {{ words.times(wordValue) | moneyCents }}
      </div>
    </div>
    <div
      v-if="checkDebug('disableUnfolding') || unfolding.showMoney"
      class="is-size-4"
    >
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
    ...mapState('game', [
      'unfolding',
      'totalWps',
      'totalMps',
    ]),
    ...mapGetters('game', [
      'wordValue',
      'checkDebug',
    ]),
  },
};
</script>
