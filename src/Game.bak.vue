<template>
  <div id="game">
    <IntroModal />

    <JobsGrid
      :show-jobs="showJobs"
      :words="words"
      @finishJob="addMoney"
      @subtractWords="subtractWords"
    />

    <StatDisplay
      :ideas="ideas"
      :words="words"
      :money="money"
      :reputation="reputation"
      :word-value="wordValue"
    />

    <CreativeButtons
      @think="think"
      @write="write"
    />

    <SellWriting
      :writing-value="writingValue"
      @sellWords="sellWords"
    />

    <CaffeineBuzz
      :show-caffeine="showCaffeine"
      :buzz-active="buzzActive()"
      :buzz-remaining="buzzRemaining()"
      :coffee-cost="coffeeCost"
      class="caffeine-section"
      @coffee="coffee"
    />

    <UpgradePanel
      :show-upgrades="showUpgrades"
      :upgrades="upgrades"
      :workers="workers"
    />

    <ProductionGrid
      :show-production="showProduction"
      :buy-amount="buyAmount"
      :workers="workers"
      @hireWorker="hireWorker"
      @setBuyAmount="setBuyAmount"
      @updateWorkerBalance="updateWorkerBalance"
    />
  </div>
</template>

<script>
// libraries/utils
import Big from 'big.js';
import generateWorkerData from './utils/generateWorkerData';
import generateUpgrades from './utils/generateUpgrades';
import randomInt from './utils/randomInt';
import unixTimestamp from './utils/unixTimestamp';
// components
import CaffeineBuzz from './components/CaffeineBuzz.vue';
import CreativeButtons from './components/CreativeButtons.vue';
import IntroModal from './components/IntroModal.vue';
import JobsGrid from './components/JobsGrid.vue';
import ProductionGrid from './components/ProductionGrid.vue';
import SellWriting from './components/SellWriting.vue';
import StatDisplay from './components/StatDisplay.vue';
import UpgradePanel from './components/UpgradePanel.vue';
// data
import defaultData from './data/defaultGameData';

export default {
  name: 'Game',
  components: {
    CaffeineBuzz,
    CreativeButtons,
    IntroModal,
    JobsGrid,
    ProductionGrid,
    SellWriting,
    StatDisplay,
    UpgradePanel,
  },
  data: () => defaultData,
  computed: {
    writingValue() {
      return this.words.times(this.wordValue);
    },
  },
  created() {
    this.workers = generateWorkerData();
    this.upgrades = generateUpgrades();
    this.calculateWorkerCosts();
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

      // unfolding updates
      if (!this.showCaffeine && this.money.gte(this.coffeeCost)) {
        this.showCaffeine = true;
      }
      if (!this.showJobs && (this.money.gte(1) || this.words.gte(100))) {
        this.showJobs = true;
      }
      if (!this.showProduction && this.money.gte(10)) {
        this.showProduction = true;
      }
      // TODO unlock upgrades

      // caffeine buzz ideas
      if (this.buzzActive()) {
        this.ideas = this.ideas.plus(this.caffeineIdeaGeneration.times(frameIncrement));
      }

      // calculate worker ideas
      let ideas = Big(0);
      Object.keys(this.workers).forEach((workerId) => {
        const worker = this.workers[workerId];

        const ideaBalance = (10 - worker.balance) / 10;
        const ideaContribution = worker.count.times(frameIncrement).times(worker.productivity).times(ideaBalance);

        if (ideaContribution.gt(0)) {
          ideas = ideas.plus(ideaContribution);
        }
      });

      // add to ideas
      this.ideas = this.ideas.plus(ideas);

      // calculate worker words
      let words = Big(0);
      Object.keys(this.workers).forEach((workerId) => {
        const worker = this.workers[workerId];

        const wordBalance = worker.balance / 10;
        const wordContribution = worker.count.times(frameIncrement).times(worker.productivity).times(wordBalance);

        if (wordContribution.gt(0)) {
          if (this.ideas.gt(wordContribution)) {
            words = words.plus(wordContribution).times(worker.efficiency);
            this.ideas = this.ideas.minus(wordContribution);
          } else {
            words = words.plus(this.ideas).times(worker.efficiency);
            this.ideas = Big(0);
          }
        }
      });

      // add to word total
      this.words = this.words.plus(words);

      // get next frame
      window.requestAnimationFrame(this.tick);
    },
    // === end global update loop ===

    // === start methods ===
    // player input
    think() {
      let ideaCount = this.baseIdeas;
      if (this.buzzActive()) {
        ideaCount = ideaCount.times(this.caffeineClickMultiplier);
      }
      this.ideas = this.ideas.plus(ideaCount);
    },
    write() {
      if (this.ideas.lt(1)) {
        return;
      }

      this.ideas = this.ideas.minus(1);
      let words = Big(randomInt(this.baseWrite, this.maxWrite));
      if (this.buzzActive()) {
        words = words.times(this.caffeineClickMultiplier);
      }

      this.words = this.words.plus(words);
    },
    // caffeine
    coffee() {
      if (this.money.lt(this.coffeeCost) || this.buzzRemaining() > this.caffeineMaxTime - 5) {
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

      this.money = this.money.minus(this.coffeeCost);
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
      this.calculateWorkerCosts();
    },
    hireWorker(id) {
      // check if can afford
      if (this.money.lt(this.workers[id].cost)) {
        return;
      }

      // buy & increment
      this.money = this.money.minus(this.workers[id].cost);
      this.workers[id].count = this.workers[id].count.plus(this.buyAmount);

      // recalculate costs
      this.calculateWorkerCosts();
    },
    updateWorkerBalance({ workerId, balance }) {
      this.workers[workerId].balance = balance;
    },
    calculateWorkerCosts() {
      const { workers } = this;
      Object.keys(this.workers).forEach((id) => {
        workers[id].cost = this.workerCost(workers[id].baseCost, workers[id].count, workers[id].costMultiplier);
      });
      // have to re-assign whole workers object to trigger reactivity
      this.workers = Object.assign({}, workers);
    },
    workerCost(baseCost, owned, costMultiplier) {
      return Big(baseCost).times(Big(1 + costMultiplier).pow(parseInt(owned.plus(this.buyAmount), 10)).minus(Big(1 + costMultiplier).pow(parseInt(owned, 10)))).div(costMultiplier).round();
    },
    // economy
    addMoney(money) {
      if (money.gt(0)) {
        this.money = this.money.plus(money);
      }
    },
    subtractWords(words) {
      if (words.gt(0)) {
        this.words = this.words.minus(words);
        if (this.words.lt(0)) {
          this.words = Big(0);
        }
      }
    },
    sellWords() {
      if (this.words.gt(0)) {
        this.addMoney(this.words.times(this.wordValue));
        this.words = Big(0);
      }
    },
    // === end methods ===
  },
};
</script>

<style lang="scss">
#game {
  text-align: center;
}
.caffeine-section {
  margin-bottom: 10px !important;
}
</style>
