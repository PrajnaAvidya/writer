<template>
  <div class="game">
    <div class="ideas">Ideas: {{ ideas | roundPositive }}</div>
    <div class="draft">Words: {{ words | round }}</div>

    <div class="columns buttons">
      <div class="column">
        <b-tooltip
          label="Think of ideas"
          position="is-bottom"
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
        <a class="button" @click="hireChild">Hire Child</a>
      </div>
      <div class="column is-half">
        <span v-if="children > 0">Children: {{ children | round }}</span>
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
    </div>
  </div>
</template>

<script>
import Big from 'big.js';
import utils from '../utils';
// import { mapGetters } from 'vuex';

export default {
  name: 'game',
  data: () => ({
    // currencies
    ideas: Big(0),
    words: Big(0),

    baseWrite: Big(1),
    maxWrite: Big(5),

    children: Big(0),
    childIdeas: Big(1),

    students: Big(0),
    studentWords: Big(1),

    // used for tick function
    lastFrame: null,

    // caffeine
    caffeineTime: 60,
    caffeineMaxTime: 300,
    caffeineEndTime: -1,
    caffeineMultiplier: Big(1),
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
        this.ideas = this.ideas.plus(this.caffeineMultiplier.times(frameIncrement));
      }

      // children
      if (this.children.gt(0)) {
        this.ideas = this.ideas.plus(this.children.times(frameIncrement).times(this.childIdeas));
      }

      // students
      if (this.students.gt(0) && this.ideas.gt(frameIncrement)) {
        this.ideas = this.ideas.minus(this.students.times(frameIncrement).times(this.studentWords));
        this.words = this.words.plus(this.students.times(frameIncrement).times(this.studentWords));
      }

      // get next frame
      window.requestAnimationFrame(this.tick);
    },

    // TODO only game core stuff (ie ticks) should be in here, everything else in components
    think() {
      const ideaCount = this.buzzActive() ? 2 : 1;
      this.ideas = this.ideas.plus(ideaCount);
      // this.$store.commit('incrementWords', 1);
    },
    write() {
      if (this.ideas.lt(1)) {
        return;
      }

      this.ideas = this.ideas.minus(1);
      this.words = this.words.plus(utils.randomInt(this.baseWrite, this.maxWrite));
    },
    coffee() {
      if (!this.buzzActive()) {
        this.caffeineEndTime = utils.unixTimestamp() + this.caffeineTime;
      } else {
        this.caffeineEndTime += this.caffeineTime;
        if (this.caffeineEndTime - utils.unixTimestamp() > this.caffeineMaxTime) {
          this.caffeineEndTime = this.lastFrame + this.caffeineMaxTime;
        }
      }
    },
    buzzActive() {
      return this.caffeineEndTime > utils.unixTimestamp();
    },
    buzzRemaining() {
      return this.caffeineEndTime - utils.unixTimestamp();
    },

    hireChild() {
      this.children = this.children.plus(1);
    },
    hireStudent() {
      this.students = this.students.plus(1);
    },
  },
};
</script>

<style lang="scss">
.production {
  margin: 0 auto;
  width: 800px;
}
.buttons {
  margin: 0 auto;
  width: 200px;
}
</style>
