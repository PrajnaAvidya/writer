<template>
  <div
    v-if="bookActive"
    class="book"
    :style="{top: `${bookPosition.y}px`, right: `${bookPosition.x}px`}"
    @click="clickBook($event)"
  >
    <img src="/images/book.png">
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Big from 'big.js';
import log from '@/utils/log';
import notify from '@/utils/notify';
import floatingText from '@/utils/floatingText';
import randomInt from '@/utils/randomInt';

export default {
  name: 'ClickableBook',
  computed: {
    ...mapState('currency', [
      'words',
      'totalWps',
    ]),
    ...mapState('books', [
      'bookActive',
      'bookPosition',
    ]),
    ...mapState('caffeine', [
      'buzzActive',
    ]),
  },
  methods: {
    clickBook(event) {
      const roll = randomInt(1, 100);
      let eventLabel;
      let floatText;
      if (roll <= 50) {
        // caffeine
        floatText = 'Caffeine';
        eventLabel = 'Caffeine';
        log('bonus caffeine buzz');
        this.$root.$emit('coffee', event, true);
      } else {
        // +words
        const words = Big(2000).plus(this.totalWps.times(randomInt(300, 600)));
        this.$root.$emit('addWords', words, true);
        log(`bonus words: ${words.toString()}`);
        eventLabel = 'Words';
        notify(`Bonus Words: ${this.$options.filters.round(words)}!`, { type: 'info', icon: 'fa-book' });

        floatText = `+${this.$options.filters.round(words)} Words`;
      }

      floatingText({
        x: event.pageX - 5,
        y: event.pageY - 20,
        text: floatText,
        time: 3000,
        height: 250,
        disappearFrom: 0.5,
        className: 'bonus-plus',
      });

      this.addToStat({ stat: 'clickables', amount: 1 });
      this.$root.$emit('setNextBook');

      this.$ga.event({
        eventCategory: 'Book',
        eventAction: 'Clicked',
        eventLabel,
      });
    },
    ...mapMutations('statistics', [
      'addToStat',
    ]),
  },
};
</script>

<style lang="scss">
.book {
  position: absolute;
  opacity: 0.75;
  z-index: 99999999;
}
.bonus-plus {
  font-weight: bold;
  font-size: 30pt;
  position : absolute;
  color: #DE636F;
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
}
</style>
