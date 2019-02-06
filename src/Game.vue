<template>
  <div id="game">
    <!-- IntroModal -->
    <TutorialModals />

    <section class="section stats">
      <CurrencyDisplay
        :words="displayedWords"
        :money="displayedMoney"
      />

      <CaffeineBuzz
        v-if="showCoffee"
        :buzz-active="buzzActive"
        class="caffeine-section"
      />

      <CreativeButtons />
    </section>

    <NavBar v-if="showNavigation" />

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
import log from '@/utils/log';
import calculateWorkerWps from '@/utils/calculateWorkerWps';
import randomInt from '@/utils/randomInt';
import unixTimestamp from '@/utils/unixTimestamp';
import workerCost from '@/utils/workerCost';
import generateJob from '@/utils/generateJob';
import generateUrgentJob from '@/utils/generateUrgentJob';
import animatePlus from '@/utils/animatePlus';
import notify from '@/utils/notify';
import notifyIconText from '@/utils/notifyIconText';
// components
// import IntroModal from '@/components/Modals/IntroModal.vue';
import TutorialModals from '@/components/Modals/TutorialModals.vue';
import NavBar from '@/components/NavBar.vue';
import CreativeButtons from '@/components/CreativeButtons.vue';
import CaffeineBuzz from '@/components/CaffeineBuzz.vue';
import CurrencyDisplay from '@/components/CurrencyDisplay.vue';

export default {
  name: 'Game',
  components: {
    NavBar,
    TutorialModals,
    CreativeButtons,
    CaffeineBuzz,
    CurrencyDisplay,
  },
  data: () => ({
    lastFrame: 0,
    utimestamp: 0,
    nextStatUpdate: 0,
    nextJobCheck: 0,

    displayedWords: Big(0),
    displayedMoney: Big(0),

    newWords: Big(0),
    newClickWords: Big(0),

    buzzActive: false,
    urgentJobNotification: null,

    caffeineX: 0,
    caffeineY: 0,
    caffeineAnimationInterval: 1,
    caffeineAnimationAmount: '1',
    caffeineAnimationNext: 0,
  }),
  computed: {
    ...mapState([
      'debug',
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
      // jobs
      'jobs',
      'jobSlots',
      'jobRewardMultiplier',
      'jobCooldown',
      'jobsAvailableTimestamps',
      'jobAvailable',
      'firstUrgentJobComplete',
      // urgent jobs
      'urgentJobActive',
      'urgentJobCountdown',
      'urgentJobExpiration',
      'urgentJobMaximumTime',
      'urgentJobMinimumTime',
      'urgentJobRewardMultiplier',
      'urgentJobTimer',
      'urgentJobTimestamp',
      // unfolding
      'showNavigation',
      'showCoffee',
    ]),
  },
  mounted() {
    // check for debug mode
    if (this.debug.enabled) {
      this.currency.words = this.debug.startingWords;
      this.currency.money = this.debug.startingMoney;
      this.updateData({ index: 'caffeineTime', value: this.debug.caffeineTime });
      this.updateData({ index: 'caffeineCooldown', value: this.debug.caffeineCooldown });
      this.updateData({ index: 'jobCooldown', value: this.debug.jobCooldown });
      if (this.debug.urgentJobs) {
        this.updateData({ index: 'urgentJobMinimumTime', value: 1 });
        this.updateData({ index: 'urgentJobMaximumTime', value: 1 });
      }
      if (this.debug.disableUnfolding) {
        this.updateData({ index: 'showMoney', value: true });
        this.updateData({ index: 'showWps', value: true });
        this.updateData({ index: 'showNavigation', value: true });
        this.updateData({ index: 'showCoffee', value: true });
        this.updateData({ index: 'showJobs', value: true });
        this.updateData({ index: 'showWorkers', value: true });
        this.updateData({ index: 'showUpgrades', value: true });
        this.updateData({ index: 'showStats', value: true });
      }
      if (this.debug.disableTutorials) {
        this.updateData({ index: 'firstJobComplete', value: true });
        this.updateData({ index: 'firstUrgentJobComplete', value: true });
      }
    }

    // loop in currency
    this.loopEffect('displayedWords', this.currency.words);
    this.loopEffect('displayedMoney', this.currency.money);

    // start game
    this.registerEvents();
    this.calculateWorkerCosts();
    this.updateWpsMps();
    window.requestAnimationFrame(this.tick);
  },
  methods: {
    registerEvents() {
      log('registering events');
      this.$root.$on('write', this.write);
      this.$root.$on('coffee', this.coffee);
      this.$root.$on('addMoney', this.addMoney);
      this.$root.$on('subtractMoney', this.subtractMoney);
      this.$root.$on('addWords', this.addWords);
      this.$root.$on('subtractWords', this.subtractWords);
      this.$root.$on('sellWords', this.sellWords);
      this.$root.$on('hireWorker', this.hireWorker);
      this.$root.$on('updateWpsMps', this.updateWpsMps);
      this.$root.$on('setNextUrgentJob', this.setNextUrgentJob);
      this.$root.$on('updateUrgentJob', this.updateUrgentJob);
      this.$root.$on('removeUpgrade', this.removeUpgrade);
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

      // update jobs
      this.updateJobs();
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
    // caffeine
    coffee(event) {
      if (this.utimestamp >= this.nextCaffeineTime) {
        // capture player mouse position
        this.caffeineX = event.pageX - 5;
        this.caffeineY = event.pageY - 20;

        this.activateCaffeine();
        this.caffeineAnimationParams();
        // show message
        notify('You feel buzzed', {
          type: 'warning',
          timeout: this.caffeineTime * 1000,
          icon: 'fa-bolt',
        });
      }
    },
    checkCaffeine() {
      if (!this.buzzActive && this.endCaffeineTime > this.utimestamp) {
        log('buzz active');
        this.buzzActive = true;
        this.updateData({ index: 'buzzActive', value: true });
        this.updateWpsMps();
      } else if (this.buzzActive) {
        if (this.endCaffeineTime <= this.utimestamp) {
          log('buzz ending');
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
          this.caffeineAnimationNext = parseInt(this.utimestamp, 10) + parseInt(this.caffeineAnimationInterval, 10);
        }
      }
    },
    // caffeine animation
    caffeineAnimationParams() {
      if (this.caffeineWordGeneration.lte(5)) {
        // show +1
        this.caffeineAnimationInterval = Big(1000).div(this.caffeineWordGeneration).toFixed();
        this.caffeineAnimationAmount = 1;
      } else if (this.caffeineWordGeneration.lt(5E6)) {
        // show rounded +X
        const roundedFraction = parseInt(this.caffeineWordGeneration.div(5).toFixed(), 10);
        this.caffeineAnimationInterval = Big(1000).div(this.caffeineWordGeneration.div(roundedFraction)).toFixed();
        this.caffeineAnimationAmount = roundedFraction;
      } else {
        // show +X every 200ms
        const fraction = this.caffeineWordGeneration.div(5);
        this.caffeineAnimationInterval = Big(1000).div(this.caffeineWordGeneration.div(fraction)).toFixed();
        this.caffeineAnimationAmount = fraction;
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
      log('recalculating worker costs');
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
    removeUpgrade(upgradeId) {
      this.addToStat({ stat: 'upgrades', amount: 1 });
      const newUpgrades = this.upgrades;
      this.$delete(newUpgrades, upgradeId);
      this.setUpgrades(newUpgrades);
    },
    updateWpsMps() {
      log('recalculating wps');
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
      this.updateData({ index: 'totalMps', value: this.totalWps.times(this.currency.wordValue) });
    },
    // jobs
    updateJobs() {
      if (this.utimestamp < this.nextJobCheck) {
        return;
      }

      for (let jobId = 1; jobId <= this.jobSlots; jobId += 1) {
        this.$set(this.jobAvailable, jobId, unixTimestamp() >= this.jobsAvailableTimestamps[jobId]);
        if (this.jobAvailable[jobId] && (!this.jobs[jobId] || this.jobs[jobId].completed === true)) {
          // generate new job
          this.jobs[jobId] = generateJob(this.currency.wordValue, this.workerWps, jobId);
        }
      }

      this.nextJobCheck = this.utimestamp + 100;
    },
    // urgent jobs
    updateUrgentJob(force = false) {
      if (force === true || (this.firstUrgentJobComplete && this.utimestamp >= this.urgentJobTimestamp)) {
        if (!this.urgentJobActive) {
          log('enabling urgent job');
          if (force === true) {
            // update end time for forced jobs
            this.updateData({ index: 'urgentJobExpiration', value: unixTimestamp(this.urgentJobTimer) });
          }
          // generate urgent job
          this.updateData({ index: 'urgentJob', value: generateUrgentJob(this.currency, this.workerWps) });
          // show notification with countdown timer
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
          log('urgent job expired');
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
      log(`next urgent job in ${time}`);

      this.updateData({ index: 'urgentJobActive', value: false });
      this.updateData({ index: 'urgentJobTimestamp', value: unixTimestamp(time) });
      this.updateData({ index: 'urgentJobExpiration', value: unixTimestamp(time + this.urgentJobTimer) });
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
    // === end methods ===
    ...mapMutations([
      'addToStat',
      'activateCaffeine',
      'updateData',
      'setWorkers',
      'setUpgrades',
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
