<template>
  <div id="game">
    <IntroModal />
    <TutorialModals />

    <section class="section stats">
      <CurrencyDisplay
        :words="displayedWords"
        :money="displayedMoney"
      />

      <CaffeineBuzz
        :buzz-active="buzzActive"
        class="caffeine-section"
      />

      <CreativeButtons />
    </section>

    <NavBar />

    <section class="section main">
      <RouterView />
    </section>
  </div>
</template>

<script>
// external libs
import Big from 'big.js';
import Noty from 'noty';
import { mapState, mapMutations } from 'vuex';
// internal libs
import calculateWorkerWps from '@/utils/calculateWorkerWps';
import generateWorkerData from '@/utils/generateWorkerData';
import generateUpgrades from '@/utils/generateUpgrades';
import randomInt from '@/utils/randomInt';
import unixTimestamp from '@/utils/unixTimestamp';
import workerCost from '@/utils/workerCost';
import generateJobs from '@/utils/generateJobs';
import animatePlus from '@/utils/animatePlus';
import notify from '@/utils/notify';
import notifyIconText from '@/utils/notifyIconText';
// components
import IntroModal from '@/components/Modals/IntroModal.vue';
import TutorialModals from '@/components/Modals/TutorialModals.vue';
import NavBar from '@/components/NavBar.vue';
import CreativeButtons from '@/components/CreativeButtons.vue';
import CaffeineBuzz from '@/components/CaffeineBuzz.vue';
import CurrencyDisplay from '@/components/CurrencyDisplay.vue';

export default {
  name: 'Game',
  components: {
    NavBar,
    IntroModal,
    TutorialModals,
    CreativeButtons,
    CaffeineBuzz,
    CurrencyDisplay,
  },
  data: () => ({
    utimestamp: 0,
    displayedWords: Big(0),
    displayedMoney: Big(0),

    newWords: Big(0),
    newClickWords: Big(0),

    lastFrame: 0,
    nextStatUpdate: 0,

    buzzActive: false,
    urgentJobNotification: null,

    caffeineX: 0,
    caffeineY: 0,
  }),
  computed: {
    ...mapState([
      // currency
      'currency',
      'playerWords',
      'totalWps',
      // upgrades
      'upgrades',
      // workers
      'workers',
      'workerQuantities',
      'workerWps',
      'buyAmount',
      'buyAmountIndex',
      // caffeine
      'caffeineTime',
      'nextCaffeineTime',
      'endCaffeineTime',
      'caffeineClickMultiplier',
      'caffeineWordGeneration',
      // caffeine animations
      'caffeineAnimationNext',
      'caffeineAnimationInterval',
      'caffeineAnimationAmount',
      // jobs
      'jobRewardMultiplier',
      'jobCooldown',
      // urgent jobs
      'urgentJobActive',
      'urgentJobExpiration',
      'urgentJobMinimumTime',
      'urgentJobMaximumTime',
      'urgentJobTimestamp',
      'urgentJobTimer',
      'urgentJobExpires',
      'urgentJobCountdown',
      'urgentJobMinimumTime',
      'urgentJobMaximumTime',
      'urgentJobRewardMultiplier',
      // debug
      'debugMode',
      'debugStartingWords',
      'debugStartingMoney',
      'debugCaffeineTime',
      'debugCaffeineCooldown',
      'debugJobCooldown',
      'debugUrgentJobs',
    ]),
  },
  created() {
    this.setupData();
  },
  mounted() {
    // check for debug mode
    if (this.debugMode) {
      this.currency.words = this.debugStartingWords;
      this.currency.money = this.debugStartingMoney;
      this.updateData({ index: 'caffeineTime', value: this.debugCaffeineTime });
      this.updateData({ index: 'caffeineCooldown', value: this.debugCaffeineCooldown });
      this.updateData({ index: 'jobCooldown', value: this.debugJobCooldown });
      if (this.debugUrgentJobs) {
        this.updateData({ index: 'urgentJobMinimumTime', value: 1 });
        this.updateData({ index: 'urgentJobMaximumTime', value: 1 });
      }
    }

    // set time for next urgent job
    this.setNextUrgentJob();

    // loop in currency
    this.loopEffect('displayedWords', this.currency.words);
    this.loopEffect('displayedMoney', this.currency.money);

    // start game
    this.registerEvents();
    window.requestAnimationFrame(this.tick);
  },
  methods: {
    // generate all the initial data
    setupData() {
      if (this.debugMode) {
        console.log('setting up initial data');
      }
      this.loadAdjectives();
      this.loadPlayerIcons();
      this.setWorkers(generateWorkerData());
      this.setUpgrades(generateUpgrades());
      this.addToStat({ stat: 'totalUpgrades', amount: Object.keys(this.upgrades).length });
      this.calculateWorkerCosts();
      this.updateWpsMps();
      this.loadTutorials();
    },
    registerEvents() {
      if (this.debugMode) {
        console.log('registering events');
      }
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
      this.$root.$on('multiplyCaffeineWords', this.multiplyCaffeineWords);
      this.$root.$on('reduceCaffeineCooldown', this.reduceCaffeineCooldown);
      this.$root.$on('multiplyWordValue', this.multiplyWordValue);
      this.$root.$on('multiplyJobCooldown', this.multiplyJobCooldown);
      this.$root.$on('multiplyJobReward', this.multiplyJobReward);
      this.$root.$on('setNextUrgentJob', this.setNextUrgentJob);
      this.$root.$on('multiplyUrgentJobCooldown', this.multiplyUrgentJobCooldown);
      this.$root.$on('multiplyUrgentJobTimer', this.multiplyUrgentJobTimer);
      this.$root.$on('multiplyUrgentJobReward', this.multiplyUrgentJobReward);
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
      this.utimestamp = unixTimestamp();

      // check caffeine
      this.checkCaffeine();

      // check urgent job
      this.updateUrgentJob();

      // how much to divide progress for current tick
      const frameIncrement = Big(1).div(Big(1000).div(progress));

      // add frame words (totalWps * increment)
      if (this.totalWps.gt(0)) {
        this.addWords(this.totalWps.times(frameIncrement));
      }

      // get next frame
      window.requestAnimationFrame(this.tick);
    },
    // === end global update loop ===

    // === start methods ===
    // ui/effects
    loopEffect(data, amount, ms = 333) {
      if (amount.eq(0)) {
        return;
      }

      const vm = this;
      let loopAmount = 10;
      if (amount.abs().lt(10)) {
        loopAmount = amount;
      }
      const tickAmount = amount.div(loopAmount);
      for (let i = 0; i < loopAmount; i += 1) {
        setTimeout(() => {
          vm[data] = vm[data].plus(tickAmount);
        }, i * ms / loopAmount);
      }
    },
    // player input
    write(event) {
      let words = this.playerWords;
      if (this.buzzActive) {
        words = words.times(this.caffeineClickMultiplier);
      }
      this.addToStat({ stat: 'clickWords', amount: words });
      this.addWords(words, true);

      // show floating + animation
      animatePlus({
        x: event.pageX - 5,
        y: event.pageY - 20,
        value: words,
        time: 500,
        height: 150,
        disappearFrom: 0.25,
      });
    },
    multiplyClickingWords(amount) {
      this.updateData({ index: 'playerWords', value: this.playerWords.times(amount) });
    },
    // caffeine
    coffee(event) {
      if (this.utimestamp >= this.nextCaffeineTime) {
        // capture player mouse position
        this.caffeineX = event.pageX - 5;
        this.caffeineY = event.pageY - 20;

        this.activateCaffeine();
        // show message
        notify('You feel buzzed', {
          type: 'warning',
          timeout: this.caffeineTime * 1000,
          icon: 'fa-bolt',
        });
      }
    },
    reduceCaffeineCooldown(amount) {
      this.adjustCaffeineTimer(-amount);
    },
    multiplyCaffeineLength(amount) {
      this.updateData({ index: 'caffeineTime', value: amount });
    },
    multiplyCaffeinePower(amount) {
      this.updateData({ index: 'caffeineClickMultiplier', value: this.caffeineClickMultiplier.times(amount) });
    },
    multiplyCaffeineWords(amount) {
      this.updateData({ index: 'caffeineWordGeneration', value: this.caffeineWordGeneration.times(amount) });
    },
    checkCaffeine() {
      if (!this.buzzActive && this.endCaffeineTime > this.utimestamp) {
        if (this.debugMode) {
          console.log('buzz active');
        }
        this.buzzActive = true;
        this.updateData({ index: 'buzzActive', value: true });
        this.updateWpsMps();
      } else if (this.buzzActive) {
        if (this.endCaffeineTime <= this.utimestamp) {
          if (this.debugMode) {
            console.log('buzz ending');
          }
          this.buzzActive = false;
          this.updateData({ index: 'buzzActive', value: false });
          this.updateWpsMps();
        } else if (this.utimestamp >= this.caffeineAnimationNext) {
          // show animation
          animatePlus({
            x: this.caffeineX,
            y: this.caffeineY,
            value: this.caffeineAnimationAmount,
            time: 500,
            height: 150,
            disappearFrom: 0.25,
          });
          this.updateData({ index: 'caffeineAnimationNext', value: parseInt(this.utimestamp, 10) + parseInt(this.caffeineAnimationInterval, 10) });
        }
      }
    },
    // workers/upgrades
    hireWorker(id) {
      // check if can afford
      if (this.currency.money.lt(this.workers[id].costs[this.buyAmountIndex])) {
        return;
      }

      // buy & increment
      this.subtractMoney(this.workers[id].costs[this.buyAmountIndex]);
      this.workers[id].quantity += this.buyAmount;
      this.addToStat({ stat: 'workers', amount: this.buyAmount });

      // recalculate stuff
      this.calculateWorkerCosts();
      this.updateWpsMps();
    },
    calculateWorkerCosts() {
      if (this.debugMode) {
        console.log('recalculating worker costs');
      }
      const { workers } = this;
      Object.keys(this.workers).forEach((id) => {
        if (this.workerQuantities[id] !== workers[id].quantity) {
          workers[id].costs[0] = workerCost(workers[id].baseCost, workers[id].quantity, workers[id].costMultiplier, 1);
          workers[id].costs[1] = workerCost(workers[id].baseCost, workers[id].quantity, workers[id].costMultiplier, 10);
          workers[id].costs[2] = workerCost(workers[id].baseCost, workers[id].quantity, workers[id].costMultiplier, 100);
          this.workerQuantities[id] = workers[id].quantity;
        }
      });
      // have to re-assign whole workers object to trigger reactivity
      this.setWorkers(workers);
    },
    multiplyProductivity(data) {
      this.workers[data.worker].productivityMultiplier = this.workers[data.worker].productivityMultiplier.times(data.amount);
      this.updateWpsMps();
    },
    removeUpgrade(upgradeId) {
      this.addToStat({ stat: 'upgrades', amount: 1 });
      const newUpgrades = this.upgrades;
      this.$delete(newUpgrades, upgradeId);
      this.setUpgrades(newUpgrades);
    },
    updateWpsMps() {
      if (this.debugMode) {
        console.log('recalculating wps');
      }
      const workerWps = calculateWorkerWps(this.workers);
      // get caffeine wps
      let totalWps = workerWps.total;
      if (this.buzzActive) {
        totalWps = totalWps.plus(this.caffeineWordGeneration);
      }
      this.updateData({ index: 'workerWps', value: workerWps.total });
      this.updateData({ index: 'totalWps', value: totalWps });
      this.updateData({ index: 'workerTooltips', value: workerWps.tooltips });
      this.updateData({ index: 'individualWorkerWps', value: workerWps.worker });
      this.updateData({ index: 'workerMps', value: this.workerWps.times(this.currency.wordValue) });
    },
    // jobs
    multiplyJobCooldown(amount) {
      this.updateData({ index: 'jobCooldown', value: this.jobCooldown * amount });
    },
    multiplyJobReward(amount) {
      this.updateData({ index: 'jobRewardMultiplier', value: this.jobRewardMultiplier.times(amount) });
    },
    // urgent jobs
    updateUrgentJob() {
      if (this.utimestamp >= this.urgentJobTimestamp) {
        if (!this.urgentJobActive) {
          if (this.debugMode) {
            console.log('enabling urgent job');
          }
          // generate job
          this.updateData({ index: 'urgentJob', value: generateJobs(this.currency.wordValue, this.workerWps, 5) });
          // show notification
          this.urgentJobNotification = notify(`<strong>Urgent Job!</strong><br>${this.urgentJobTimer} seconds left to accept`, {
            type: 'error',
            icon: 'fa-bullhorn',
            timeout: (this.urgentJobTimer - 0.75) * 1000,
            closeWith: 'button',
            buttons: [
              Noty.button('Go to Agency', 'button is-link is-primary', () => {
                this.$router.push('/jobs');
              }, { id: 'button1', 'data-status': 'ok' }),
            ],
          });
          this.updateData({ index: 'urgentJobActive', value: true });
        } else if (this.utimestamp >= this.urgentJobExpiration) {
          if (this.debugMode) {
            console.log('urgent job expired');
          }
          this.updateData({ index: 'urgentJobActive', value: false });
          this.urgentJobNotification.close();
          this.setNextUrgentJob();
        }
      }
      if (this.urgentJobActive) {
        // update countdowns
        this.updateData({ index: 'urgentJobCountdown', value: parseInt(((this.urgentJobExpiration) - this.utimestamp) / 1000, 10) });
        this.urgentJobNotification.setText(notifyIconText(`<strong>Urgent Job!</strong><br>${this.urgentJobCountdown} seconds left to accept`, 'fa-bullhorn'));
      }
    },
    setNextUrgentJob() {
      const time = randomInt(this.urgentJobMinimumTime, this.urgentJobMaximumTime);
      if (this.urgentJobNotification) {
        this.urgentJobNotification.close();
      }
      if (this.debugMode) {
        console.log(`next urgent job in ${time}`);
      }

      this.updateData({ index: 'urgentJobActive', value: false });
      this.updateData({ index: 'urgentJobTimestamp', value: unixTimestamp(time) });
      this.updateData({ index: 'urgentJobExpiration', value: unixTimestamp(time + this.urgentJobTimer) });
    },
    multiplyUrgentJobCooldown(amount) {
      this.updateData({ index: 'urgentJobMinimumTime', value: amount * this.urgentJobMinimumTime });
      this.updateData({ index: 'urgentJobMaximumTime', value: amount * this.urgentJobMaximumTime });
    },
    multiplyUrgentJobTimer(amount) {
      this.updateData({ index: 'urgentJobTimer', value: amount * this.urgentJobTimer });
      this.updateData({ index: 'urgentJobExpiration', value: this.urgentJobTimestamp + (1000 * this.urgentJobTimer) });
    },
    multiplyUrgentJobReward(amount) {
      this.updateData({ index: 'urgentJobRewardMultiplier', value: this.urgentJobRewardMultiplier.times(amount) });
    },
    // economy
    addMoney(money, loop = true) {
      // add money
      this.currency.money = this.currency.money.plus(money);
      this.addToStat({ stat: 'money', amount: money });

      // loop in effect
      if (loop && money.gt(this.currency.money.div(1000))) {
        this.loopEffect('displayedMoney', money);
      } else {
        this.displayedMoney = this.displayedMoney.plus(money);
      }
    },
    subtractMoney(money, loop = true) {
      // subtract money
      this.currency.money = this.currency.money.minus(money);
      this.addToStat({ stat: 'moneySpent', amount: money });
      if (this.currency.money.lt(0)) {
        this.currency.money = Big(0);
      }

      // loop in effect
      if (loop && money.gt(this.currency.money.div(1000))) {
        this.loopEffect('displayedMoney', money.times(-1), 166);
      } else {
        this.displayedMoney = this.displayedMoney.minus(money);
      }
    },
    addWords(words, loop = false) {
      this.currency.words = this.currency.words.plus(words);
      this.addToStat({ stat: 'words', amount: words });

      // loop in effect
      if (loop && words.gt(this.workerWps.div(10))) {
        this.loopEffect('displayedWords', words);
      } else {
        this.displayedWords = this.displayedWords.plus(words);
      }
    },
    subtractWords(words, loop = true) {
      this.currency.words = this.currency.words.minus(words);
      if (this.currency.words.lt(0)) {
        this.currency.words = Big(0);
      }

      // loop in effect
      if (loop && words.gt(this.workerWps.div(10))) {
        this.loopEffect('displayedWords', words.times(-1), 166);
      } else {
        this.displayedWords = this.displayedWords.plus(words);
      }
    },
    multiplyWordValue(amount) {
      this.currency.wordValue = this.currency.wordValue.times(amount);
      this.updateWpsMps();
    },
    // === end methods ===
    ...mapMutations([
      'addToStat',
      'activateCaffeine',
      'adjustCaffeineTimer',
      'setWorkers',
      'setUpgrades',
      'updateData',
      'loadAdjectives',
      'loadPlayerIcons',
      'loadTutorials',
    ]),
  },
};
</script>

<style lang="scss">
#game {
  text-align: center;
}
.stats {
  padding-top: 20px !important;
}
.nav {
  padding-top: 0px;
  padding-bottom: 0px;
}
.stats, .main {
  padding: 0;
  width: 900px;
  margin: 0 auto;
}
.caffeine-section {
  padding: 25px;
  margin: 0 auto;
}
.floating-plus {
  font-weight: bold;
  position : absolute;
  color: #DE636F;
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
}
.test1234 {
  vertical-align: top;
}
</style>
