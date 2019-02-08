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
import randomInt from '@/utils/randomInt';

export default {
  name: 'ClickableBook',
  computed: {
    ...mapState([
      'currency',
      'workerWps',
      'bookActive',
      'bookPosition',
      'buzzActive',
    ]),
  },
  methods: {
    clickBook($event) {
      const roll = randomInt(1, 100);
      log(`roll: ${roll}`);
      let eventLabel;
      if (roll <= 40 && !this.buzzActive) {
        // caffeine
        this.$root.$emit('coffee', $event, true);
        log('bonus caffeine buzz');
        eventLabel = 'Caffeine';
      } else if (roll <= 80) {
        // +words
        let words = this.currency.words.times(randomInt(10, 50) / 100).plus(1800);
        if (words.gt(1800) && words.gt(this.workerWps.times(1800))) {
          words = this.workerWps.times(1800).plus(1800);
        }
        this.$root.$emit('addWords', words, true);
        log(`bonus words: ${words.toString()}`);
        eventLabel = 'Words';
        notify(`Bonus Words: ${this.$options.filters.round(words)}!`, { icon: 'fa-book' });
      } else {
        // +money
        let money = this.currency.money.times(randomInt(10, 50) / 100).plus(600);
        if (money.gt(600) && money.gt(this.workerWps.times(3600).times(this.currency.wordValue))) {
          money = this.workerWps.times(3600).times(this.currency.wordValue).plus(600);
        }
        this.$root.$emit('addMoney', money);
        log(`bonus money: ${money.toString()}`);
        eventLabel = 'Money';
        notify(`Bonus Money: ${this.$options.filters.round(money)}!`, { icon: 'fa-book' });
      }

      this.addToStat({ stat: 'clickables', amount: 1 });
      this.$root.$emit('setNextBook');

      this.$ga.event({
        eventCategory: 'Book',
        eventAction: 'Clicked',
        eventLabel,
      });
    },
    ...mapMutations([
      'addToStat',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.book {
  position: absolute;
  opacity: 0.75;
  z-index: 99999999;
}
</style>
