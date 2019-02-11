<template>
  <div class="monospace">
    <Transition name="fade">
      <div class="is-size-3">
        Words: {{ words | round }}
      </div>
    </Transition>
    <div
      v-if="checkUnfolding('showWps')"
      class="is-size-6"
      :class="{ pulse: buzzActive, buzz: buzzActive }"
    >
      Words per Second: {{ totalWps | round }}
    </div>
    <div v-if="checkDebug('enabled')">
      <div>
        Base Word Value (DEBUG): {{ words.times(wordValue) | moneyCents }}
      </div>
    </div>
    <div
      v-if="checkUnfolding('showMoney')"
      class="is-size-4"
    >
      Money: {{ money | money }}
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
    ...mapState('currency', [
      'totalWps',
      'wordValue',
    ]),
    ...mapState('caffeine', [
      'buzzActive',
    ]),
    ...mapGetters('debug', [
      'checkDebug',
    ]),
    ...mapGetters('unfolding', [
      'checkUnfolding',
    ]),
  },
};
</script>

<style lang="scss">
.buzz {
  color: $red;
  font-size: 16pt !important;
}
</style>
