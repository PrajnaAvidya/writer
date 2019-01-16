<template>
  <div id="game">
    <jobs-grid
      @startJob="startJob"
      @finishJob="finishJob"
      :words="jobWords"
    />

    <hr />

    <stat-display
      :ideas="ideas"
      :words="words"
      :money="money"
    />

    <creative-buttons
      @think="think"
      @write="write"
    />

    <hr />

    <buy-amounts
      @setBuyAmount="setBuyAmount"
    />

    <caffeine-buzz
      @coffee="coffee"
      :buzzActive="buzzActive()"
      :buzzRemaining="buzzRemaining()"
    />

    <production-grid
      @hireWorker="hireWorker"
      :buyAmount="buyAmount"
      :workers="workers"
    />
  </div>
</template>

<script>
// libraries/utils
import Big from 'big.js';
import generateWorkerData from './utils/generateWorkerData';
import randomInt from './utils/randomInt';
import unixTimestamp from './utils/unixTimestamp';
// components
import BuyAmounts from './components/BuyAmounts.vue';
import CaffeineBuzz from './components/CaffeineBuzz.vue';
import CreativeButtons from './components/CreativeButtons.vue';
import JobsGrid from './components/JobsGrid.vue';
import ProductionGrid from './components/ProductionGrid.vue';
import StatDisplay from './components/StatDisplay.vue';
// data
import defaultData from './data/defaultGameData';

export default {
  name: 'game',
  components: {
    BuyAmounts,
    CaffeineBuzz,
    CreativeButtons,
    JobsGrid,
    ProductionGrid,
    StatDisplay,
  },
  data: () => defaultData,
  created() {
    this.workers = generateWorkerData();
    this.calculateBuyCosts();
  },
  mounted() {
    window.requestAnimationFrame(this.tick);
  },
  methods: {
    // === start global update loop ===
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

      // how much to divide progress for current tick
      const frameIncrement = Big(1).div(Big(1000).div(progress));

      // start actual frame updates

      // caffeine buzz
      if (this.buzzActive()) {
        this.ideas = this.ideas.plus(this.caffeineMultiplier.times(frameIncrement));
      }

      /*
      // TODO new worker processing
      let words = Big(0);

      // children
      if (this.children.gt(0)) {
        this.ideas = this.ideas.plus(this.children.times(frameIncrement).times(this.childIdeas));
      }

      // students
      if (this.students.gt(0) && this.ideas.gt(frameIncrement)) {
        this.ideas = this.ideas.minus(this.students.times(frameIncrement).times(this.studentWords));
        words = words.plus(this.students.times(frameIncrement).times(this.studentWords));
      }

      if (this.jobActive) {
        this.jobWords = this.jobWords.plus(words);
      } else {
        this.words = this.words.plus(words);
      }
      */

      // get next frame
      window.requestAnimationFrame(this.tick);
    },
    // === end global update loop ===

    // === start methods ===
    // player input
    think() {
      const ideaCount = this.buzzActive() ? 2 : 1;
      this.ideas = this.ideas.plus(ideaCount);
    },
    write() {
      if (this.ideas.lt(1)) {
        return;
      }

      this.ideas = this.ideas.minus(1);
      let words = randomInt(this.baseWrite, this.maxWrite);
      if (this.buzzActive()) {
        words *= 2;
      }

      if (this.jobActive) {
        this.jobWords = this.jobWords.plus(words);
      } else {
        this.words = this.words.plus(words);
      }
    },
    // caffeine
    coffee() {
      if (this.money.lt(2) || this.buzzRemaining() > this.caffeineMaxTime - 5) {
        return;
      }
      if (!this.buzzActive()) {
        this.caffeineEndTime = unixTimestamp() + this.caffeineTime;
      } else {
        this.caffeineEndTime += this.caffeineTime;
        if (this.caffeineEndTime - unixTimestamp() > this.caffeineMaxTime) {
          this.caffeineEndTime = unixTimestamp() + this.caffeineMaxTime;
        }
      }

      this.money = this.money.minus(2);
    },
    buzzActive() {
      return this.caffeineEndTime > unixTimestamp();
    },
    buzzRemaining() {
      return this.caffeineEndTime - unixTimestamp();
    },
    // workers
    setBuyAmount(index) {
      this.buyAmount = 10 ** index;
      this.calculateBuyCosts();
    },
    hireWorker(id) {
      // check if can afford
      if (this.money.lt(this.workers[id].cost)) {
        return;
      }

      // buy & increment
      this.money = this.money.minus(this.workers[id].cost);
      this.workers[id].count += this.buyAmount;

      // recalculate costs
      this.calculateBuyCosts();
    },
    calculateBuyCosts() {
      const { workers } = this;
      Object.keys(this.workers).forEach((id) => {
        workers[id].cost = this.buyCost(workers[id].baseCost, workers[id].count, workers[id].costMultiplier);
      });
      // have to re-assign whole workers object to trigger reactivity
      this.workers = Object.assign({}, workers);
    },
    buyCost(baseCost, owned, costMultiplier) {
      return Big(baseCost).times(Big(1 + costMultiplier).pow(parseInt(owned + this.buyAmount, 10))
        .minus(Big(1 + costMultiplier).pow(owned))).div(costMultiplier).round();
    },
    // jobs
    startJob() {
      this.jobWords = Big(0);
      this.jobActive = true;
    },
    finishJob(reward) {
      if (reward.gt(0)) {
        this.money = this.money.plus(reward);
      }
      this.jobActive = false;
    },
    // === end methods ===
  },
};
</script>

<style lang="scss">
#game {
  text-align: center;
}
</style>
