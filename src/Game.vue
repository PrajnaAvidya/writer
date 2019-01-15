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
import Big from 'big.js';
import utils from './utils';
import workerData from './data/workers';
// import { mapGetters } from 'vuex';

// components
import BuyAmounts from './components/BuyAmounts.vue';
import CaffeineBuzz from './components/CaffeineBuzz.vue';
import CreativeButtons from './components/CreativeButtons.vue';
import JobsGrid from './components/JobsGrid.vue';
import ProductionGrid from './components/ProductionGrid.vue';
import StatDisplay from './components/StatDisplay.vue';

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
  data: () => ({
    // currencies
    ideas: Big(0),
    words: Big(0),
    money: Big(20),

    // jobs
    jobWords: Big(0),
    jobActive: false,

    // player writing range
    baseWrite: Big(1),
    maxWrite: Big(3),

    // caffeine
    caffeineTime: 60,
    caffeineMaxTime: 300,
    caffeineEndTime: -1,
    caffeineMultiplier: Big(1),

    // workers (generated)
    workers: {},

    // number of things to buy
    buyAmount: 1,

    // used for tick function
    lastFrame: null,
  }),
  /*
  computed: {
    ...mapGetters([
      // 'words',
      // 'caffeine',
    ]),
  },
  */
  created() {
    this.generateWorkerData();
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

      // how much to divide progress current tick
      const frameDivision = Big(1000).div(progress);
      const frameIncrement = Big(1).div(frameDivision);

      // start actual frame updates
      let words = Big(0);

      // caffeine buzz
      if (this.buzzActive()) {
        this.ideas = this.ideas.plus(this.caffeineMultiplier.times(frameIncrement));
      }

      // children
      /*
      if (this.children.gt(0)) {
        this.ideas = this.ideas.plus(this.children.times(frameIncrement).times(this.childIdeas));
      }

      // students
      if (this.students.gt(0) && this.ideas.gt(frameIncrement)) {
        this.ideas = this.ideas.minus(this.students.times(frameIncrement).times(this.studentWords));
        words = words.plus(this.students.times(frameIncrement).times(this.studentWords));
      }
      */

      if (this.jobActive) {
        this.jobWords = this.jobWords.plus(words);
      } else {
        this.words = this.words.plus(words);
      }

      // get next frame
      window.requestAnimationFrame(this.tick);
    },
    // === end global update loop ===

    // === start methods ===
    think() {
      const ideaCount = this.buzzActive() ? 2 : 1;
      this.ideas = this.ideas.plus(ideaCount);
    },
    write() {
      if (this.ideas.lt(1)) {
        return;
      }

      this.ideas = this.ideas.minus(1);
      let words = utils.randomInt(this.baseWrite, this.maxWrite);
      if (this.buzzActive()) {
        words *= 2;
      }

      if (this.jobActive) {
        this.jobWords = this.jobWords.plus(words);
      } else {
        this.words = this.words.plus(words);
      }
    },
    coffee() {
      if (this.money.lt(2) || this.buzzRemaining() > this.caffeineMaxTime - 5) {
        return;
      }
      if (!this.buzzActive()) {
        this.caffeineEndTime = utils.unixTimestamp() + this.caffeineTime;
      } else {
        this.caffeineEndTime += this.caffeineTime;
        if (this.caffeineEndTime - utils.unixTimestamp() > this.caffeineMaxTime) {
          this.caffeineEndTime = utils.unixTimestamp() + this.caffeineMaxTime;
        }
      }

      this.money = this.money.minus(2);
    },
    buzzActive() {
      return this.caffeineEndTime > utils.unixTimestamp();
    },
    buzzRemaining() {
      return this.caffeineEndTime - utils.unixTimestamp();
    },
    setBuyAmount(index) {
      this.buyAmount = 10 ** index;
      this.calculateBuyCosts();
    },
    buyCost(baseCost, owned, costMultiplier) {
      return Big(baseCost).times(Big(1 + costMultiplier).pow(parseInt(owned + this.buyAmount, 10))
        .minus(Big(1 + costMultiplier).pow(owned))).div(costMultiplier).round();
    },
    // workers
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
    generateWorkerData() {
      workerData.forEach((worker) => {
        this.workers[worker.id] = {
          id: worker.id,
          name: worker.name,
          plural: worker.plural,
          count: 0,
          cost: worker.baseCost,
          baseCost: worker.baseCost,
          costMultiplier: worker.costMultiplier,
        };
      });
    },
    calculateBuyCosts() {
      const ids = Object.keys(this.workers);
      const { workers } = this;
      ids.forEach((id) => {
        workers[id].cost = this.buyCost(workers[id].baseCost, workers[id].count, workers[id].costMultiplier);
      });
      this.workers = Object.assign({}, workers);
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
