<template>
  <div class="game">
    <div class="words">Words: {{ words | roundPositive }}</div>
    <div class="draft">Draft: {{ draft | round }} words</div>

    <div class="columns buttons">
      <div class="column">
        <b-tooltip
          label="Write some words"
          position="is-bottom"
          class="write"
        >
          <a class="button is-primary" @click="write">
            <b-icon icon="pen" />
          </a>
        </b-tooltip>
      </div>
      <div class="column">
        <b-tooltip
          label="Edit writing"
          position="is-bottom"
          class="write"
        >
          <a class="button is-primary" @click="edit">
            <b-icon icon="paragraph" />
          </a>
        </b-tooltip>
      </div>
      <div class="column">
        <b-tooltip
          label="Edit writing"
          position="is-bottom"
          class="write"
        >
          <a class="button is-primary" @click="edit">
            <b-icon icon="keyboard" />
          </a>
        </b-tooltip>
      </div>
    </div>

    <hr />

    <div class="production columns is-multiline">
      <!-- row -->
      <div class="column is-half">
        <a class="button" @click="coffee">Drink Coffee</a>
      </div>
      <div class="column is-half">
        <span v-if="buzzActive()">Caffeine Buzz Remaining: {{ buzzRemaining() }} seconds</span>
      </div>
      <!-- /row -->

      <!-- row -->
      <div class="column is-half">
        <a class="button" @click="hireEditor">Hire Editor</a>
      </div>
      <div class="column is-half">
        <span v-if="editors > 0">Editors: {{ editors | round }}</span>
      </div>
      <!-- /row -->
    </div>
  </div>
</template>

<script>
import Big from 'big.js';
// import { mapGetters } from 'vuex';

export default {
  name: 'game',
  data: () => ({
    words: Big(0),
    baseWords: Big(1),
    maxWords: Big(2),
    draft: Big(0),
    baseEdit: Big(1),
    maxEdit: Big(4),

    editors: Big(0),

    lastFrame: null,

    // caffeine
    caffeineTime: 60,
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
      const frameIncrement = Big(1).div(frameDivision);
      if (this.buzzActive()) {
        this.words = this.words.plus(frameIncrement);
      }

      if (this.editors.gt(0) && this.words.gt(frameIncrement)) {
        this.words = this.words.minus(this.editors.times(frameIncrement));
        this.draft = this.draft.plus(this.editors.times(frameIncrement));
      }

      // get next frame
      window.requestAnimationFrame(this.tick);
    },

    // TODO only game core stuff (ie ticks) should be in here, everything else in components
    write() {
      const words = this.randomInt(this.baseWords, this.maxWords);
      this.words = this.words.plus(words);
      // this.$store.commit('incrementWords', 1);
    },
    edit() {
      let words = this.randomInt(this.baseEdit, this.maxEdit);
      if (words > this.words) {
        // this is weird af but what airbnb style guide wants me to do
        ({ words } = this);
      }
      this.draft = this.draft.plus(words);
      this.words = this.words.minus(words);
    },
    coffee() {
      if (this.caffeineEndTime < this.lastFrame) {
        this.caffeineEndTime = this.lastFrame + this.caffeineTime * 1000;
      } else {
        this.caffeineEndTime += this.caffeineTime * 1000;
      }
    },
    buzzActive() {
      return this.caffeineEndTime > this.lastFrame;
    },
    buzzRemaining() {
      return this.$options.filters.round((this.caffeineEndTime - this.lastFrame) / 1000);
    },
    hireEditor() {
      this.editors = this.editors.plus(1);
    },

    randomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
  },
};
</script>

<style lang="scss">
.words {
  margin-bottom: 8px;
}

.draft {
  margin-bottom: 15px;
}

.write {
  margin-bottom: 20px;
}

.production {
  margin: 0 auto;
  width: 800px;
}
.buttons {
  margin: 0 auto;
  width: 200px;
}
</style>
