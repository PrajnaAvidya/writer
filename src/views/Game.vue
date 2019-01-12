<template>
  <div class="game">
    <div class="words">Words: {{ words | round }}</div>

    <b-tooltip
      label="Write some words"
      position="is-bottom"
      class="write"
    >
      <a class="button is-primary" @click="write">
        <b-icon icon="pen" />
      </a>
    </b-tooltip>

    <hr />

    <div class="production">
      <div class="columns">
        <div class="column">
          <a class="button" @click="coffee">Drink Coffee</a>
        </div>
        <div class="column">
          Caffeine Buzz Remaining: {{ caffeineEndTime - lastFrame | round }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Big from 'big.js';
// import { mapGetters } from 'vuex';
import utils from '../utils';

export default {
  name: 'game',
  data: () => ({
    words: Big(0),
    lastFrame: null,

    // caffeine
    caffeineTime: 60,
    buzzActive: false,
    caffeineEndTime: -1,
  }),
  /*
  computed: {
    ...mapGetters([
      // 'words',
      // 'caffeine',
    ]),
  },
  */
  filters: {
    round: value => utils.round(value),
  },
  mounted() {
    window.requestAnimationFrame(this.tick);
  },
  methods: {
    tick(timestamp) {
      // get time since last frame
      const progress = timestamp - this.lastFrame;

      // restrict game to 30 fps
      if (progress < 33.333) {
        window.requestAnimationFrame(this.tick);
        return;
      }

      // set current frame
      this.lastFrame = timestamp;

      // how much to divide progress current tick
      const frameDivision = Big(1000).div(progress);

      // TODO actual frame updates
      if (this.caffeineEndTime > this.lastFrame) {
        this.words = this.words.plus(Big(1).div(frameDivision));
      }

      // get next frame
      window.requestAnimationFrame(this.tick);
    },

    // TODO only game core stuff (ie ticks) should be in here, everything else in components
    write() {
      this.words = this.words.plus(1);
      // this.$store.commit('incrementWords', 1);
    },
    coffee() {
      if (this.caffeineEndTime < this.lastFrame) {
        this.caffeineEndTime = this.lastFrame + this.caffeineTime * 1000;
      } else {
        this.caffeineEndTime += this.caffeineTime * 1000;
      }
    },
  },
};
</script>

<style lang="scss">
.words {
  margin-bottom: 15px;
}

.write {
  margin-bottom: 20px;
}

.production {
  margin: 0 auto;
  width: 800px;
}
</style>
