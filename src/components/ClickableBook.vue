<template>
  <div
    v-if="bookActive"
    class="book"
    :style="{ top: `${bookPosition.y}px`, right: `${bookPosition.x}px` }"
    @click="clickBook($event)"
  >
    <img src="@/assets/book.png">
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import log from '@/utils/log';
import notify from '@/utils/notify';
import animatePlus from '@/utils/animatePlus';
import randomInt from '@/utils/randomInt';

export default {
  name: 'ClickableBook',
  computed: {
    ...mapState('game', [
      'currency',
      'totalWps',
      'bookActive',
      'bookPosition',
      'buzzActive',
    ]),
  },
  methods: {
    clickBook(event) {
      const roll = randomInt(1, 100);
      let eventLabel;
      if (roll <= 50 && !this.buzzActive) {
        // caffeine
        this.$root.$emit('coffee', event, true);
        log('bonus caffeine buzz');
        eventLabel = 'Caffeine';
      } else {
        // +words
        let words = this.currency.words.times(randomInt(10, 50) / 100).plus(1800);
        if (words.gt(1800) && words.gt(this.totalWps.times(1800))) {
          words = this.totalWps.times(1800).plus(1800);
        }
        this.$root.$emit('addWords', words, true);
        log(`bonus words: ${words.toString()}`);
        eventLabel = 'Words';
        notify(`Bonus Words: ${this.$options.filters.round(words)}!`, { icon: 'fa-book' });

        animatePlus({
          x: event.pageX - 5,
          y: event.pageY - 20,
          value: `${this.$options.filters.round(words)} Words`,
          time: 3000,
          height: 250,
          disappearFrom: 0.5,
          className: 'bonus-plus',
        });
      }
      /*
      else {
        // +money
        let money = this.currency.money.times(randomInt(10, 50) / 100).plus(600);
        if (money.gt(600) && money.gt(this.totalWps.times(3600).times(this.currency.wordValue))) {
          money = this.totalWps.times(3600).times(this.currency.wordValue).plus(600);
        }
        this.$root.$emit('addMoney', money);
        log(`bonus money: ${money.toString()}`);
        eventLabel = 'Money';
        notify(`Bonus Money: ${this.$options.filters.moneyCents(money)}!`, { icon: 'fa-book' });

        animatePlus({
          x: event.pageX - 5,
          y: event.pageY - 20,
          value: `${this.$options.filters.moneyCents(money)}`,
          time: 3000,
          height: 250,
          disappearFrom: 0.5,
          className: 'bonus-plus',
        });
      }
      */

      this.addToStat({ stat: 'clickables', amount: 1 });
      this.$root.$emit('setNextBook');

      this.$ga.event({
        eventCategory: 'Book',
        eventAction: 'Clicked',
        eventLabel,
      });
    },
    ...mapMutations('game', [
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
  font-size: 250%;
  position : absolute;
  color: #DE636F;
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
}
</style>
