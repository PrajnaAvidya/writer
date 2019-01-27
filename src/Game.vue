<template>
  <div id="game">
    <IntroModal />

    <section class="section stats">
      <CurrencyDisplay />

      <CaffeineBuzz
        :buzz-active="buzzActive()"
        :buzz-remaining="buzzRemaining()"
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
      <RouterView />
    </section>
  </div>
</template>

<script>
// libraries/utils
import Big from 'big.js';
import { mapState, mapMutations } from 'vuex';
import calculateWorkerWps from '@/utils/calculateWorkerWps';
import generateWorkerData from '@/utils/generateWorkerData';
import generateUpgrades from '@/utils/generateUpgrades';
import randomInt from '@/utils/randomInt';
import unixTimestamp from '@/utils/unixTimestamp';
// components
import CaffeineBuzz from '@/components/CaffeineBuzz.vue';
import IntroModal from '@/components/IntroModal.vue';
import CurrencyDisplay from '@/components/CurrencyDisplay.vue';

export default {
  name: 'Game',
  components: {
    CaffeineBuzz,
    IntroModal,
    CurrencyDisplay,
  },
  data: () => ({
    // stats tracking
    newWords: Big(0),
    newClickWords: Big(0),

    // used for tick function
    lastFrame: 0,
    nextStatUpdate: 0,
  }),
  computed: {
    ...mapState([
      'money',
      'words',
      'buyAmount',
      'upgrades',
      'workers',
      'workerWps',
      'playerWords',
      'endCaffeineTime',
      'caffeineClickMultiplier',
      'jobRewardMultiplier',
      'baseWordValue',
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
      this.setWorkers(generateWorkerData());
      this.setUpgrades(generateUpgrades());
      this.addToStat({ stat: 'totalUpgrades', amount: Object.keys(this.upgrades).length });
      this.calculateWorkerCosts();
    },
    registerEvents() {
      this.$root.$on('write', this.write);
      this.$root.$on('coffee', this.coffee);
      this.$root.$on('hireWorker', this.hireWorker);
      this.$root.$on('addMoney', this.addMoney);
      this.$root.$on('subtractMoney', this.subtractMoney);
      this.$root.$on('addWords', this.addWords);
      this.$root.$on('subtractWords', this.subtractWords);
      this.$root.$on('sellWords', this.sellWords);
      this.$root.$on('multiplyProductivity', this.multiplyProductivity);
      this.$root.$on('removeUpgrade', this.removeUpgrade);
      this.$root.$on('multiplyClickingWords', this.multiplyClickingWords);
      this.$root.$on('addCaffeineMaxLength', this.addCaffeineMaxLength);
      this.$root.$on('multiplyCaffeineLength', this.multiplyCaffeineLength);
      this.$root.$on('multiplyCaffeinePower', this.multiplyCaffeinePower);
      this.$root.$on('reduceCaffeineCooldown', this.reduceCaffeineCooldown);
      this.$root.$on('multiplyWordValue', this.multiplyWordValue);
      this.$root.$on('reduceJobCooldown', this.reduceJobCooldown);
      this.$root.$on('multiplyJobReward', this.multiplyJobReward);
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

      // add worker words
      this.addWords(this.workerWps.times(frameIncrement));

      // get next frame
      window.requestAnimationFrame(this.tick);
    },
    // === end global update loop ===

    // === start methods ===
    // player input
    write() {
      let words = this.playerWords;
      if (this.buzzActive()) {
        words = words.times(this.caffeineClickMultiplier);
      }
      this.addToStat({ stat: 'clickWords', amount: words });
      this.addWords(words);
    },
    multiplyClickingWords(amount) {
      if (amount <= 1) {
        return;
      }
      this.updateData({ index: 'playerWords', value: this.playerWords.times(amount) });
    },
    // caffeine
    coffee() {
      if (unixTimestamp() >= this.nextCaffeineTime) {
        this.activateCaffeine({ timer: this.caffeineTime, cooldown: this.caffeineCooldown });
      }
    },
    buzzActive() {
      return this.endCaffeineTime > unixTimestamp();
    },
    buzzRemaining() {
      return this.endCaffeineTime - unixTimestamp();
    },
    reduceCaffeineCooldown(amount) {
      if (amount < 1) {
        return;
      }
      this.adjustCaffeineTimer(-amount);
    },
    multiplyCaffeineLength(amount) {
      if (amount <= 1) {
        return;
      }
      this.updateData({ index: 'caffeineTime', value: amount });
    },
    multiplyCaffeinePower(amount) {
      if (amount <= 1) {
        return;
      }
      this.updateData({ index: 'caffeineClickMultiplier', value: this.caffeineClickMultiplier.times(amount) });
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

      // recalculate stuff
      this.calculateWorkerCosts();
      this.updateData({ index: 'workerWps', value: calculateWorkerWps(this.workers) });
    },
    calculateWorkerCosts() {
      const { workers } = this;
      Object.keys(this.workers).forEach((id) => {
        workers[id].cost = this.workerCost(workers[id].baseCost, workers[id].quantity, workers[id].costMultiplier);
      });
      // have to re-assign whole workers object to trigger reactivity
      this.setWorkers(workers);
    },
    workerCost(baseCost, owned, costMultiplier) {
      return Big(baseCost).times(Big(1 + costMultiplier).pow(parseInt(owned.plus(this.buyAmount), 10)).minus(Big(1 + costMultiplier).pow(parseInt(owned, 10)))).div(costMultiplier).round();
    },
    multiplyProductivity(data) {
      if (data.amount <= 1) {
        return;
      }

      this.workers[data.worker].productivityMultiplier = this.workers[data.worker].productivityMultiplier.times(data.amount);
      this.updateData({ index: 'workerWps', value: calculateWorkerWps(this.workers) });
    },
    removeUpgrade(upgradeId) {
      this.addToStat({ stat: 'upgrades', amount: 1 });
      const newUpgrades = this.upgrades;
      this.$delete(newUpgrades, upgradeId);
      this.setUpgrades(newUpgrades);
    },
    // jobs
    reduceJobCooldown(amount) {
      if (amount < 1) {
        return;
      }

      this.adjustJobTimer(-amount);
    },
    multiplyJobReward(amount) {
      if (amount <= 1) {
        return;
      }

      this.updateData({ index: 'jobRewardMultiplier', value: this.jobRewardMultiplier.times(amount) });
    },
    // economy
    addMoney(money) {
      if (money.gt(0)) {
        this.updateData({ index: 'money', value: this.money.plus(money) });
        this.addToStat({ stat: 'money', amount: money });
      }
    },
    subtractMoney(money) {
      if (money.gt(0)) {
        this.updateData({ index: 'money', value: this.money.minus(money) });
        this.addToStat({ stat: 'moneySpent', amount: money });
        if (this.money.lt(0)) {
          this.money = Big(0);
        }
      }
    },
    addWords(words) {
      if (words.gt(0)) {
        this.updateData({ index: 'words', value: this.words.plus(words) });
        this.addToStat({ stat: 'words', amount: this.newWords });
      }
    },
    subtractWords(words) {
      if (words.gt(0)) {
        let newWords = this.words.minus(words);
        if (newWords.lt(0)) {
          newWords = Big(0);
          this.updateData({ index: 'words', value: newWords });
        }
      }
    },
    multiplyWordValue(amount) {
      if (amount > 1) {
        this.updateData({ index: 'baseWordValue', value: this.baseWordValue.times(amount) });
        this.updateData({ index: 'workerWps', value: calculateWorkerWps(this.workers) });
      }
    },
    // === end methods ===
    ...mapMutations([
      'addToStat',
      'adjustJobTimer',
      'activateCaffeine',
      'adjustCaffeineTimer',
      'setWorkers',
      'setUpgrades',
      'updateData',
    ]),
  },
};
</script>

<style lang="scss" scoped>
#game {
  text-align: center;
}
</style>
