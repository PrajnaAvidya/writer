<template>
  <div id="game">
    <IntroModal />

    <section class="section stats">
      <StatDisplay
        :ideas="ideas"
        :words="words"
        :money="money"
        :word-value="wordValue"
      />

      <hr>

      <SellWriting :writing-value="writingValue" />

      <CaffeineBuzz
        :show-caffeine="showCaffeine"
        :buzz-active="buzzActive()"
        :buzz-remaining="buzzRemaining()"
        :coffee-cost="coffeeCost"
        class="caffeine-section"
      />
    </section>

    <section class="section nav">
      <div id="nav">
        <hr>
        <RouterLink to="/">
          Home
        </RouterLink>
        |
        <RouterLink to="/workers">
          Workers
        </RouterLink>
        |
        <RouterLink to="/agency">
          Agency
        </RouterLink>
        |
        <RouterLink to="/upgrades">
          Upgrades
        </RouterLink>
        |
        <RouterLink to="/stats">
          Stats
        </RouterLink>
        <hr>
      </div>
    </section>

    <section class="section main">
      <RouterView
        :show-jobs="showJobs"
        :show-production="showProduction"
        :show-upgrades="showUpgrades"
        :words="words"
        :money="money"
        :workers="workers"
        :upgrades="upgrades"
        :assignments="assignments"
        :job-timer="jobTimer"
      />
    </section>
  </div>
</template>

<script>
// libraries/utils
import Big from 'big.js';
import { mapState, mapMutations } from 'vuex';
import generateWorkerData from './utils/generateWorkerData';
import generateUpgrades from './utils/generateUpgrades';
import randomInt from './utils/randomInt';
import unixTimestamp from './utils/unixTimestamp';
// components
import CaffeineBuzz from './components/CaffeineBuzz.vue';
import IntroModal from './components/IntroModal.vue';
import SellWriting from './components/SellWriting.vue';
import StatDisplay from './components/StatDisplay.vue';
// data
import defaultData from './data/defaultGameData';

export default {
  name: 'Game',
  components: {
    CaffeineBuzz,
    IntroModal,
    SellWriting,
    StatDisplay,
  },
  data: () => defaultData,
  computed: {
    writingValue() {
      return this.words.times(this.wordValue);
    },
    ...mapState([
      'buyAmount',
      'jobActive',
      'nextJobTime',
    ]),
  },
  created() {
    this.setupData();
  },
  mounted() {
    this.registerEvents();

    // subscribe to mutations
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setBuyAmountIndex') {
        this.calculateWorkerCosts();
      }
    });

    // start game
    window.requestAnimationFrame(this.tick);
  },
  methods: {
    // generate all the initial data
    setupData() {
      this.workers = generateWorkerData();
      this.upgrades = generateUpgrades();
      this.addToStat({ stat: 'totalUpgrades', amount: Object.keys(this.upgrades).length });
      this.calculateWorkerCosts();
    },
    registerEvents() {
      this.$root.$on('think', this.think);
      this.$root.$on('write', this.write);
      this.$root.$on('coffee', this.coffee);
      this.$root.$on('hireWorker', this.hireWorker);
      this.$root.$on('updateWorkerBalance', this.updateWorkerBalance);
      this.$root.$on('addMoney', this.addMoney);
      this.$root.$on('subtractMoney', this.subtractMoney);
      this.$root.$on('addWords', this.addWords);
      this.$root.$on('subtractWords', this.subtractWords);
      this.$root.$on('sellWords', this.sellWords);
      this.$root.$on('multiplyEfficiency', this.multiplyEfficiency);
      this.$root.$on('multiplyProductivity', this.multiplyProductivity);
      this.$root.$on('removeUpgrade', this.removeUpgrade);
      this.$root.$on('multiplyClickingIdeas', this.multiplyClickingIdeas);
      this.$root.$on('multiplyClickingWords', this.multiplyClickingWords);
      this.$root.$on('multiplyClickingMaxWords', this.multiplyClickingMaxWords);
    },
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

      // TODO redo unfolding
      /*
      if (!this.showCaffeine && this.money.gte(this.coffeeCost)) {
        this.showCaffeine = true;
      }
      if (!this.showJobs && (this.money.gte(1) || this.words.gte(100))) {
        this.showJobs = true;
      }
      if (!this.showProduction && this.money.gte(10)) {
        this.showProduction = true;
      }
      */

      // check job cooldown
      if (!this.jobActive && unixTimestamp() >= this.nextJobTime) {
        this.setJobActive();
      }

      // caffeine buzz ideas
      if (this.buzzActive()) {
        this.ideas = this.ideas.plus(this.caffeineIdeaGeneration.times(frameIncrement));
      }

      // calculate worker ideas
      let ideas = Big(0);
      Object.keys(this.workers).forEach((workerId) => {
        const worker = this.workers[workerId];

        const ideaBalance = (10 - worker.balance) / 10;
        const ideaContribution = worker.quantity.times(frameIncrement).times(worker.productivityMultiplier.times(worker.baseProductivity)).times(ideaBalance);

        if (ideaContribution.gt(0)) {
          ideas = ideas.plus(ideaContribution);
        }
      });

      // add to ideas
      this.ideas = this.ideas.plus(ideas);
      this.newIdeas = this.newIdeas.plus(ideas);

      // calculate worker words
      let words = Big(0);
      Object.keys(this.workers).forEach((workerId) => {
        const worker = this.workers[workerId];

        const wordBalance = worker.balance / 10;
        const wordContribution = worker.quantity.times(frameIncrement).times(worker.productivityMultiplier.times(worker.baseProductivity)).times(wordBalance);

        if (wordContribution.gt(0)) {
          if (this.ideas.gt(wordContribution)) {
            words = words.plus(wordContribution).times(worker.efficiencyMultiplier.times(worker.baseEfficiency));
            this.ideas = this.ideas.minus(wordContribution);
          } else {
            words = words.plus(this.ideas).times(worker.efficiencyMultiplier.times(worker.baseEfficiency));
            this.ideas = Big(0);
          }
        }
      });

      // add to word total
      this.words = this.words.plus(words);
      this.newWords = this.newWords.plus(words);

      // update stats periodically
      if (unixTimestamp() > this.nextStatUpdate) {
        console.log('updating stats');
        this.addToStat({ stat: 'ideas', amount: this.newIdeas });
        this.addToStat({ stat: 'words', amount: this.newWords });
        this.addToStat({ stat: 'clickIdeas', amount: this.newClickIdeas });
        this.addToStat({ stat: 'clickWords', amount: this.newClickWords });
        this.newIdeas = Big(0);
        this.newWords = Big(0);
        this.newClickIdeas = Big(0);
        this.newClickWords = Big(0);

        this.nextStatUpdate = unixTimestamp() + 3;
      }

      // get next frame
      window.requestAnimationFrame(this.tick);
    },
    // === end global update loop ===

    // === start methods ===
    // player input
    think() {
      let ideas = this.baseIdeas;
      if (this.buzzActive()) {
        ideas = ideas.times(this.caffeineClickMultiplier);
      }
      this.newIdeas = this.newIdeas.plus(ideas);
      this.newClickIdeas = this.newClickIdeas.plus(ideas);
      this.ideas = this.ideas.plus(ideas);
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
      this.newWords = this.newWords.plus(words);
      this.newClickWords = this.newClickWords.plus(words);
      this.words = this.words.plus(words);
    },
    multiplyClickingIdeas(amount) {
      if (amount <= 1) {
        return;
      }
      this.baseIdeas = this.baseIdeas.times(amount);
    },
    multiplyClickingWords(amount) {
      if (amount <= 1) {
        return;
      }
      this.baseWrite = this.baseWrite.times(amount);
      this.maxWrite = this.maxWrite.times(amount);
    },
    multiplyClickingMaxWords(amount) {
      if (amount <= 1) {
        return;
      }
      this.maxWrite = this.maxWrite.times(amount);
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

      this.subtractMoney(this.coffeeCost);
    },
    buzzActive() {
      return this.caffeineEndTime > unixTimestamp();
    },
    buzzRemaining() {
      return this.caffeineEndTime - unixTimestamp();
    },
    // workers/upgrades
    hireWorker(id) {
      // check if can afford
      if (this.money.lt(this.workers[id].cost)) {
        return;
      }

      // buy & increment
      this.subtractMoney(this.workers[id].cost);
      this.workers[id].quantity = this.workers[id].quantity.plus(this.buyAmount);

      // recalculate costs
      this.calculateWorkerCosts();
    },
    updateWorkerBalance({ workerId, balance }) {
      this.workers[workerId].balance = balance;
    },
    calculateWorkerCosts() {
      const { workers } = this;
      Object.keys(this.workers).forEach((id) => {
        workers[id].cost = this.workerCost(workers[id].baseCost, workers[id].quantity, workers[id].costMultiplier);
      });
      // have to re-assign whole workers object to trigger reactivity
      this.workers = Object.assign({}, workers);
    },
    workerCost(baseCost, owned, costMultiplier) {
      return Big(baseCost).times(Big(1 + costMultiplier).pow(parseInt(owned.plus(this.buyAmount), 10)).minus(Big(1 + costMultiplier).pow(parseInt(owned, 10)))).div(costMultiplier).round();
    },
    multiplyEfficiency(data) {
      if (data.amount <= 1) {
        return;
      }
      this.workers[data.worker].efficiencyMultiplier = this.workers[data.worker].efficiencyMultiplier.times(data.amount);
    },
    multiplyProductivity(data) {
      if (data.amount <= 1) {
        return;
      }
      this.workers[data.worker].productivityMultiplier = this.workers[data.worker].productivityMultiplier.times(data.amount);
    },
    removeUpgrade(upgradeId) {
      this.addToStat({ stat: 'upgrades', amount: 1 });
      this.$delete(this.upgrades, upgradeId);
    },
    // economy
    addMoney(money) {
      if (money.gt(0)) {
        this.money = this.money.plus(money);
        this.addToStat({ stat: 'money', amount: money });
      }
    },
    subtractMoney(money) {
      if (money.gt(0)) {
        this.money = this.money.minus(money);
        this.addToStat({ stat: 'moneySpent', amount: money });
        if (this.money.lt(0)) {
          this.money = Big(0);
        }
      }
    },
    addWords(words) {
      if (words.gt(0)) {
        this.words = this.words.plus(words);
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
    ...mapMutations([
      'setJobActive',
      'addToStat',
    ]),
  },
};
</script>

<style lang="scss">
#game {
  text-align: center;
}
.stats, .main {
  padding: 0;
  width: 900px;
  margin: 0 auto;
}
.stats {
  padding-top: 20px;
}
.nav {
  padding: 25px;
}
.caffeine-section {
  margin-bottom: 10px !important;
}
</style>
