<template>
  <div class="game">
    <div class="ideas">Ideas: {{ ideas | roundPositive }}</div>
    <div class="draft">Words: {{ words | round }}</div>

    <div class="columns buttons">
      <div class="column">
        <b-tooltip
          label="Think of ideas"
          position="is-bottom"
          class="think"
        >
          <a class="button is-primary is-large" @click="think">
            <b-icon icon="brain" />
          </a>
        </b-tooltip>
      </div>
      <div class="column">
        <b-tooltip
          label="Write some words"
          position="is-bottom"
          class="write"
        >
          <a class="button is-primary is-large" @click="write">
            <b-icon icon="pen" />
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
        <a class="button" @click="hireStudent">Hire Student</a>
      </div>
      <div class="column is-half">
        <span v-if="students > 0">Students: {{ students | round }}</span>
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
    // currencies
    ideas: Big(0),
    words: Big(0),

    baseWrite: Big(1),
    maxWrite: Big(5),

    students: Big(0),
    editors: Big(0),

    // used for tick function
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

      // actual frame updates
      const frameIncrement = Big(1).div(frameDivision);

      // caffeine buzz
      if (this.buzzActive()) {
        this.ideas = this.ideas.plus(frameIncrement);
      }

      // students
      if (this.students.gt(0) && this.ideas.gt(frameIncrement)) {
        this.ideas = this.ideas.minus(this.students.times(frameIncrement));
        this.words = this.words.plus(this.students.times(frameIncrement));
      }

      // editors
      /*
      if (this.editors.gt(0) && this.words.gt(frameIncrement)) {
        this.words = this.words.minus(this.editors.times(frameIncrement));
        this.draft = this.draft.plus(this.editors.times(frameIncrement));
      }
      */

      // get next frame
      window.requestAnimationFrame(this.tick);
    },

    // TODO only game core stuff (ie ticks) should be in here, everything else in components
    think() {
      this.ideas = this.ideas.plus(1);
      // this.$store.commit('incrementWords', 1);
    },
    write() {
      if (this.ideas.lt(1)) {
        return;
      }

      this.ideas = this.ideas.minus(1);
      this.words = this.words.plus(this.randomInt(this.baseWrite, this.maxWrite));
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

    hireStudent() {
      this.students = this.students.plus(1);
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
.ideas {
  margin-bottom: 8px;
}

.think, .write {
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
