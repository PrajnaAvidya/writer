<template>
  <div id="game">
    <ClickableBook />
    <Component :is="crazyBooksComponent" />

    <Component
      :is="unfoldingComponent"
      ref="unfolding"
    />

    <section class="section stats">
      <CurrencyDisplay
        :words="displayedWords"
        :money="displayedMoney"
      />

      <CaffeineBuzz
        v-if="checkUnfolding('showCoffee')"
        class="caffeine-section"
      />

      <CreativeButtons />
    </section>

    <NavBar v-if="checkUnfolding('showNavigation')" />

    <section class="section main">
      <KeepAlive>
        <RouterView />
      </KeepAlive>
    </section>

    <div class="push" />
  </div>
</template>

<script>
// external libs
import Big from 'big.js';
import Noty from 'noty';
import { mapState, mapMutations, mapGetters } from 'vuex';
import localforage from 'localforage';
// utility libs
import log from '@/utils/log';
import unixTimestamp from '@/utils/unixTimestamp';
import randomInt from '@/utils/randomInt';
import notify from '@/utils/notify';
import notifyIconText from '@/utils/notifyIconText';
// game libs
import calculateWorkerWps from '@/utils/calculateWorkerWps';
import workerCost from '@/utils/workerCost';
import generateJob from '@/utils/generateJob';
import generateUrgentJob from '@/utils/generateUrgentJob';
// components
import ClickableBook from '@/components/ClickableBook.vue';
import UnfoldingTutorials from '@/components/UnfoldingTutorials.vue';
import NavBar from '@/components/NavBar.vue';
import CreativeButtons from '@/components/CreativeButtons.vue';
import CaffeineBuzz from '@/components/CaffeineBuzz.vue';
import CurrencyDisplay from '@/components/CurrencyDisplay.vue';
// data
import gameData from '@/data/game';
import milestoneData from '@/data/milestones';
// effects
import CrazyBooks from '@/components/CrazyBooks.vue';
import animatePlus from '@/utils/animatePlus';
import particles from '@/utils/particles';
// save/load
import save from '@/utils/save';
import load from '@/utils/load';

export default {
  name: 'Game',
  components: {
    NavBar,
    ClickableBook,
    CrazyBooks,
    UnfoldingTutorials,
    CreativeButtons,
    CaffeineBuzz,
    CurrencyDisplay,
  },
  data: () => gameData(),
  computed: {
    ...mapState('upgrades', [
      'upgrades',
    ]),
    ...mapState('statistics', [
      'stats',
      'milestoneTargets',
      'milestoneCount',
    ]),
    ...mapState('currency', [
      'words',
      'money',
      'wordValue',
      'milestones',
      'playerWords',
      'totalWps',
    ]),
    ...mapState('caffeine', [
      'buzzActive',
      'caffeineTime',
      'nextCaffeineTime',
      'endCaffeineTime',
      'caffeineClickMultiplier',
      'caffeineMinimumWordGeneration',
    ]),
    ...mapState('books', [
      'bookActive',
      'bookMinimumTime',
      'bookMaximumTime',
      'nextBookTime',
      'bookSpawnTime',
      'bookExpireTime',
    ]),
    ...mapState('jobs', [
      // regular jobs
      'jobs',
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
    ]),
    ...mapState('workers', [
      'workers',
      'workerQuantities',
      'workerWps',
      'buyAmount',
      'buyAmountIndex',
    ]),
    ...mapState('rebirth', [
      'rebirths',
      'plotPoints',
      'bonuses',
      'baseMilestonesNeeded',
    ]),
    ...mapState('tutorials', [
      'tutorials',
      'currentTutorial',
    ]),
    ...mapGetters('debug', [
      'checkDebug',
    ]),
    ...mapGetters('unfolding', [
      'checkUnfolding',
    ]),
    ...mapGetters('rebirth', [
      'jobSlots',
    ]),
  },
  mounted() {
    this.setupGame();
  },
  methods: {
    async setupGame(rebirth = false) {
      if (rebirth) {
        this.rebirthGame();
      } else {
        const saveData = await localforage.getItem('writerSave');
        if (saveData && !this.checkDebug('disableAutoload')) {
          await this.loadGame(saveData.timestamp);
        } else {
          this.newGame();
        }
      }

      // check for debug mode
      this.setDebugMode();

      // show bonus panel
      this.revealUnfolding('showBonus');

      // loop in currency
      this.loopEffect('displayedWords', this.words);
      this.loopEffect('displayedMoney', this.money);

      // start game
      this.particles = particles();
      this.calculateWorkerCosts(true);
      this.updateWps();
      window.requestAnimationFrame(this.tick);
    },
    async loadGame(timestamp) {
      await load().then(() => {
        this.$ga.event({
          eventCategory: 'Game',
          eventAction: 'Load',
          eventLabel: this.utimestamp,
        });

        // enable tutorials/unfolding if necessary
        if (this.currentTutorial) {
          this.unfoldingComponent = 'UnfoldingTutorials';
          this.loadFirstTutorial = true;
        }

        // offline earnings
        const timeDifference = (unixTimestamp() - timestamp) / 1000;
        if (timeDifference >= 60) {
          const offlineWords = this.totalWps.times(timeDifference);
          this.addMoney(offlineWords);
          log(`applied offline earnings for ${timeDifference} seconds: ${this.$options.filters.round(offlineWords)} words`);
        }

        // register events
        this.registerEvents();
      });
    },
    newGame() {
      this.$ga.event({
        eventCategory: 'Game',
        eventAction: 'New',
        eventLabel: this.utimestamp,
      });

      // enable tutorials/unfolding
      this.unfoldingComponent = 'UnfoldingTutorials';
      this.loadFirstTutorial = true;

      this.setNextBook();

      // register events
      this.registerEvents();
    },
    rebirthGame() {
      this.$ga.event({
        eventCategory: 'Game',
        eventAction: 'Rebirth',
        eventLabel: `Rebirths: ${this.rebirths.toString()}`,
      });

      this.setNextBook();
    },
    setDebugMode() {
      if (this.checkDebug('enabled')) {
        const debugSettings = this.$store.state.debug;
        if (debugSettings.startingWords) {
          this.setCurrencyData({ index: 'words', value: debugSettings.startingWords });
        }
        if (debugSettings.startingMoney) {
          this.setCurrencyData({ index: 'money', value: debugSettings.startingMoney });
        }
        if (debugSettings.startingPlotPoints) {
          this.setRebirthData({ index: 'plotPoints', value: debugSettings.startingPlotPoints });
        }
        if (debugSettings.jobCooldown) {
          this.setJobsData({ index: 'jobCooldown', value: debugSettings.jobCooldown });
        }
        if (debugSettings.caffeineTime) {
          this.setCaffeineData({ index: 'caffeineTime', value: debugSettings.caffeineTime });
        }
        if (debugSettings.caffeineCooldown) {
          this.setCaffeineData({ index: 'caffeineCooldown', value: debugSettings.caffeineCooldown });
        }
        if (this.checkDebug('urgentJobs')) {
          this.setJobsData({ index: 'urgentJobMinimumTime', value: 1 });
          this.setJobsData({ index: 'urgentJobMaximumTime', value: 1 });
        }
        if (this.checkDebug('books')) {
          this.setBooksData({ index: 'bookMinimumTime', value: 1 });
          this.setBooksData({ index: 'bookMaximumTime', value: 1 });
        }
        if (this.checkDebug('disableUnfolding')) {
          this.revealUnfolding('firstJobComplete');
          this.revealUnfolding('firstUrgentJobComplete');
          this.setNextUrgentJob();
        }
      }
    },
    registerEvents() {
      log('registering events');
      // save before closing window
      window.addEventListener('beforeunload', () => {
        if (!this.unloadSave && !this.checkDebug('disableAutosave')) {
          this.unloadSave = true;
          save();
        }
      });
      window.addEventListener('unload', () => {
        if (!this.unloadSave && !this.checkDebug('disableAutosave')) {
          this.unloadSave = true;
          save();
        }
      });
      // game root events
      this.$root.$on('write', this.write);
      this.$root.$on('coffee', this.coffee);
      this.$root.$on('addMoney', this.addMoney);
      this.$root.$on('subtractMoney', this.subtractMoney);
      this.$root.$on('addWords', this.addWords);
      this.$root.$on('subtractWords', this.subtractWords);
      this.$root.$on('sellWords', this.sellWords);
      this.$root.$on('hireWorker', this.hireWorker);
      this.$root.$on('updateWps', this.updateWps);
      this.$root.$on('setNextUrgentJob', this.setNextUrgentJob);
      this.$root.$on('updateUrgentJob', this.updateUrgentJob);
      this.$root.$on('removeUpgrade', this.removeUpgrade);
      this.$root.$on('setNextBook', this.setNextBook);
      this.$root.$on('endUnfolding', () => { this.unfoldingComponent = null; });
      this.$root.$on('crazy', () => {
        this.haltAnimation = true;
        this.crazyBooksComponent = 'CrazyBooks';
      });
      this.$root.$on('rebirth', this.doRebirth);
    },
    // === start global update loop ===
    tick(timestamp) {
      if (this.haltAnimation) {
        return;
      }

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

      // check/update stuff
      if (this.loadFirstTutorial && this.$refs.unfolding !== undefined) {
        this.$refs.unfolding.getNextTutorial(this.currentTutorial);
        this.loadFirstTutorial = false;
      }
      this.checkCaffeine();
      this.checkBook();
      this.updateMilestones();
      this.updateJobs();
      this.updateUrgentJob();

      // how much to divide progress for current tick
      const frameIncrement = Big(1).div(Big(1000).div(progress));

      // add frame words (totalWps * increment)
      if (this.totalWps.gt(0)) {
        this.addWords(this.totalWps.times(frameIncrement));
      }

      // update title
      this.updateTitle();

      if (!this.checkDebug('disableAutosave') && this.utimestamp >= this.nextSave) {
        save();
        this.nextSave = unixTimestamp(this.saveInterval);
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
      let loopAmount = 10.0;
      if (amount.abs().lt(10)) {
        loopAmount = amount;
      }

      if (loopAmount !== 10.0) {
        // deal with fractions -- subtract fractional amount from loopamount & add immediately
        const decimalAmount = loopAmount.round(0, 0).minus(loopAmount).abs();
        vm[data] = vm[data].plus(decimalAmount);

        loopAmount = loopAmount.minus(decimalAmount);
        amount = amount.minus(decimalAmount);
      }

      const tickAmount = amount.div(loopAmount);
      for (let i = 0; i < loopAmount; i += 1) {
        setTimeout(() => {
          vm[data] = vm[data].plus(tickAmount);
        }, i * ms / loopAmount);
      }
    },
    updateTitle() {
      if (this.utimestamp >= this.nextTitleUpdate) {
        let prefix = '';
        if (this.urgentJobActive && this.bookActive) {
          prefix = '[B][J] ';
        } else if (this.urgentJobActive) {
          prefix = '[J] ';
        } else if (this.bookActive) {
          prefix = '[B] ';
        }

        document.title = `${prefix}Writer - ${this.$options.filters.round(this.words)}W $${this.$options.filters.round(this.money)}`;

        this.nextTitleUpdate = unixTimestamp(3);
      }
    },
    // player input
    write(event) {
      let words = this.playerWords;
      if (this.buzzActive) {
        words = words.times(this.caffeineClickMultiplier).plus(this.bonuses.caffeineClickWps.times(this.workerWps));
        this.particles.spawnParticle(event.pageX - 5, event.pageY - 20);
      }
      // add plot bonus
      words = words.times(Big(1).plus(this.plotPoints.div(100)));
      this.addToStat({ stat: 'clickWords', amount: words });
      this.addWords(words, true);

      // show floating + animation
      animatePlus({
        x: event.pageX - 5,
        y: event.pageY - 20,
        value: this.$options.filters.round(words),
        time: 500,
        height: 150,
        disappearFrom: 0.25,
      });
    },
    // caffeine
    coffee(event, force = false) {
      if (force || this.utimestamp >= this.nextCaffeineTime) {
        // capture player mouse position
        this.caffeineX = event.pageX - 5;
        this.caffeineY = event.pageY - 20;

        this.activateCaffeine(force);
        this.caffeineAnimationParams();
        // show message
        notify('You feel buzzed', {
          type: 'warning',
          timeout: this.caffeineTime * 1000,
          icon: 'fa-bolt',
        });

        this.$ga.event({
          eventCategory: 'Caffeine',
          eventAction: 'Activate',
          eventLabel: this.caffeineWordGeneration.toString(),
        });
      }
    },
    checkCaffeine() {
      if (!this.buzzActive && this.endCaffeineTime > this.utimestamp) {
        log('buzz active');
        this.setCaffeineData({ index: 'buzzActive', value: true });
        this.updateWps();
      } else if (this.buzzActive) {
        if (this.endCaffeineTime <= this.utimestamp) {
          log('buzz ending');
          this.setCaffeineData({ index: 'buzzActive', value: false });
          this.updateWps();
        } else if (this.utimestamp >= this.caffeineAnimationNext) {
          this.particles.spawnParticle(this.caffeineX, this.caffeineY);
          // show animation
          animatePlus({
            x: this.caffeineX,
            y: this.caffeineY,
            value: this.$options.filters.round(this.caffeineAnimationAmount.times(Big(1).plus(this.plotPoints.div(100)))),
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
      const wordGeneration = this.bonuses.caffeineWordMultiplier.times(this.totalWps).times(Big(1).plus(this.plotPoints.div(100)));
      this.caffeineWordGeneration = wordGeneration.gt(this.caffeineMinimumWordGeneration) ? wordGeneration : this.caffeineMinimumWordGeneration;

      if (this.caffeineWordGeneration.lte(5)) {
        // show +1
        this.caffeineAnimationInterval = Big(1000).div(this.caffeineWordGeneration).toFixed();
        this.caffeineAnimationAmount = Big(1);
      } else if (this.caffeineWordGeneration.lt(5E6)) {
        // show rounded +X
        const roundedFraction = parseInt(this.caffeineWordGeneration.div(5).toFixed(), 10);
        this.caffeineAnimationInterval = Big(1000).div(this.caffeineWordGeneration.div(roundedFraction)).toFixed();
        this.caffeineAnimationAmount = Big(roundedFraction);
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
      if (this.money.lt(this.workers[id].costs[this.buyAmountIndex])) {
        return;
      }

      // buy & increment
      this.subtractMoney(this.workers[id].costs[this.buyAmountIndex]);
      this.workers[id].quantity += this.buyAmount;
      this.addToStat({ stat: 'workers', amount: this.buyAmount });

      // recalculate stuff
      this.calculateWorkerCosts();
      this.updateWps();

      this.$ga.event({
        eventCategory: 'Workers',
        eventAction: 'Hired',
        eventLabel: `${this.buyAmount} ${this.workers[id].pluralName}`,
      });
    },
    calculateWorkerCosts(force = false) {
      log('recalculating worker costs');
      const { workers } = this;
      Object.keys(this.workers).forEach((id) => {
        if (force || this.workerQuantities[id] !== workers[id].quantity) {
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
    updateWps() {
      log('recalculating wps');
      // get plot bonus
      const plotBonus = Big(1).plus(this.plotPoints.div(100));
      // get worker wps
      const workerWps = calculateWorkerWps(this.workers, this.buzzActive, this.bonuses.workerCaffeine, this.bonuses.caffeineWordMultiplier);
      // add plot point bonus
      let totalWps = workerWps.total.times(plotBonus);
      // add caffeine wps
      if (this.buzzActive) {
        totalWps = totalWps.plus(this.caffeineWordGeneration.times(plotBonus));
      }
      this.setCurrencyData({ index: 'totalWps', value: totalWps });
      this.setWorkersData({ index: 'workerWps', value: workerWps.total.times(plotBonus) });
      this.setWorkersData({ index: 'workerTooltips', value: workerWps.tooltips });
      this.setWorkersData({ index: 'individualWorkerWps', value: workerWps.worker });
    },
    // jobs
    updateJobs(force = false) {
      if (!force && this.utimestamp < this.nextJobCheck) {
        return;
      }

      for (let jobId = 1; jobId <= this.jobSlots; jobId += 1) {
        this.$set(this.jobAvailable, jobId, this.utimestamp >= this.jobsAvailableTimestamps[jobId]);
        if (force || (this.jobAvailable[jobId] && (!this.jobs[jobId] || this.jobs[jobId].completed === true))) {
          // generate new job
          this.jobs[jobId] = generateJob(this.wordValue, this.workerWps, jobId);
        }
      }

      this.nextJobCheck = unixTimestamp(0.1);
    },
    // urgent jobs
    updateUrgentJob(force = false) {
      if (force === true || (this.checkUnfolding('firstUrgentJobComplete') && this.utimestamp >= this.urgentJobTimestamp)) {
        if (!this.urgentJobActive) {
          log('enabling urgent job');
          if (force === true) {
            // update end time for forced jobs
            this.setJobsData({ index: 'urgentJobExpiration', value: unixTimestamp(this.urgentJobTimer) });
          }
          // generate urgent job
          this.setJobsData({ index: 'urgentJob', value: generateUrgentJob(this.words, this.wordValue, this.workerWps) });
          this.setJobsData({ index: 'urgentJobActive', value: true });
        } else if (this.utimestamp >= this.urgentJobExpiration) {
          log('urgent job expired');
          this.setJobsData({ index: 'urgentJobActive', value: false });
          if (this.urgentJobNotification) {
            this.urgentJobNotification.close();
          }
          this.setNextUrgentJob();
        }
      }
      if (this.urgentJobActive) {
        // update countdowns
        this.setJobsData({ index: 'urgentJobCountdown', value: parseInt(((this.urgentJobExpiration) - this.utimestamp) / 1000, 10) });
        if (!this.urgentJobNotification) {
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
        }
        this.urgentJobNotification.setText(notifyIconText(`<strong>Urgent Job!</strong><br>${this.urgentJobCountdown} seconds left to accept`, 'fa-bullhorn'));
      }
    },
    setNextUrgentJob() {
      const time = randomInt(this.urgentJobMinimumTime, this.urgentJobMaximumTime);
      if (this.urgentJobNotification) {
        this.urgentJobNotification.close();
      }
      log(`next urgent job in ${time}`);

      this.setJobsData({ index: 'urgentJobActive', value: false });
      this.setJobsData({ index: 'urgentJobTimestamp', value: unixTimestamp(time) });
      this.setJobsData({ index: 'urgentJobExpiration', value: unixTimestamp(time + this.urgentJobTimer) });
    },
    // clickables
    setNextBook() {
      const time = randomInt(this.bookMinimumTime, this.bookMaximumTime);
      this.setBooksData({ index: 'bookActive', value: false });
      this.setBooksData({ index: 'nextBookTime', value: unixTimestamp(time) });
      this.setBooksData({ index: 'bookExpireTime', value: unixTimestamp(time + this.bookSpawnTime) });
      log(`next book in ${time}`);
    },
    checkBook() {
      if (!this.bookActive && this.utimestamp >= this.nextBookTime) {
        this.setBooksData({
          index: 'bookPosition',
          value: {
            x: Math.floor(Math.random() * document.body.offsetWidth),
            y: Math.floor(Math.random() * document.body.offsetHeight),
          },
        });
        this.setBooksData({ index: 'bookActive', value: true });
        log('book active');
      } else if (this.bookActive && this.utimestamp >= this.bookExpireTime) {
        this.setBooksData({ index: 'bookActive', value: false });
        this.setNextBook();
        log('book expired');
      }
    },
    // economy
    addMoney(money, loop = true) {
      // add money
      this.addCurrencyData({ index: 'money', amount: money });
      this.addToStat({ stat: 'money', amount: money });

      // loop in effect
      if (loop && money.gt(this.money.div(1000))) {
        this.loopEffect('displayedMoney', money);
      } else {
        this.displayedMoney = this.displayedMoney.plus(money);
      }
    },
    subtractMoney(money, loop = true) {
      // subtract money
      this.addCurrencyData({ index: 'money', amount: money.times(-1) });
      this.addToStat({ stat: 'moneySpent', amount: money });
      if (this.money.lt(0)) {
        this.setCurrencyData({ index: 'money', value: Big(0) });
      }

      // loop in effect
      if (loop && money.gt(this.money.div(1000))) {
        this.loopEffect('displayedMoney', money.times(-1), 166);
      } else {
        this.displayedMoney = this.displayedMoney.minus(money);
      }
    },
    addWords(words, loop = false) {
      this.addCurrencyData({ index: 'words', amount: words });
      this.addToStat({ stat: 'words', amount: words });

      // loop in effect
      if (loop && words.gt(this.totalWps.div(10))) {
        this.loopEffect('displayedWords', words);
      } else {
        this.displayedWords = this.displayedWords.plus(words);
      }
    },
    subtractWords(words, loop = true) {
      this.addCurrencyData({ index: 'words', amount: words.times(-1) });
      if (this.words.lt(0)) {
        this.setCurrencyData({ index: 'words', value: Big(0) });
      }

      // loop in effect
      if (loop && words.gt(this.totalWps.div(10))) {
        this.loopEffect('displayedWords', words.times(-1), 166);
      } else {
        this.displayedWords = this.displayedWords.plus(words);
      }
    },
    // stats
    updateMilestones() {
      if (this.utimestamp < this.nextMilestoneCheck) {
        return;
      }

      // update max wps
      if (this.totalWps.gt(this.stats.wps)) {
        this.setStatisticsData({ index: 'wps', value: this.totalWps });
      }

      Object.keys(this.milestoneTargets).forEach((stat) => {
        if (this.stats[stat].gte(this.milestoneTargets[stat])) {
          log(`got milestone for ${stat}`);
          // give currency
          this.addCurrencyData({ index: 'milestones', amount: 1 });

          // show message
          notify('You completed a milestone!', {
            type: 'info',
            icon: 'fa-star',
            callbacks: {
              onClick: () => {
                this.$router.push('/stats');
              },
            },
          });

          // set next milestone
          this.milestoneCount[stat] += 1;
          this.milestoneTargets[stat] = this.milestoneTargets[stat].times(milestoneData[stat].multiplier);

          // unlock stats
          this.revealUnfolding('showStats');

          this.$ga.event({
            eventCategory: 'Milestone',
            eventAction: 'Completed',
            eventLabel: `${stat} ${this.milestoneCount[stat]}`,
          });
        }
      });

      if (this.milestones.gte(10)) {
        this.revealUnfolding('showRebirth');
      }
      if (!this.rebirthNotification && this.milestones.gte(this.baseMilestonesNeeded.plus(this.rebirths))) {
        notify('Rebirth Ready', {
          type: 'alert',
          icon: 'fa-recycle',
          callbacks: {
            onClick: () => {
              this.$router.push('/rebirth');
            },
          },
        });
        this.rebirthNotification = true;
      }

      this.nextMilestoneCheck = unixTimestamp(0.5);
    },
    // rebirth
    doRebirth() {
      // update rebirth data
      this.addRebirthData({ index: 'plotPoints', amount: this.milestones });
      this.addRebirthData({ index: 'plotPoints', amount: this.words.e });
      this.addRebirthData({ index: 'rebirths', amount: 1 });

      // reload relevant vuex stores
      this.resetCurrency();
      this.resetStatistics();
      this.resetIcons();
      this.resetCaffeine();
      this.resetBooks();
      this.resetJobs();
      this.resetWorkers();
      this.resetUpgrades();
      this.updateJobs(true);

      // reload game data
      Object.assign(this.$data, gameData());

      // start game
      this.haltAnimation = false;
      this.setupGame(true);
    },
    // === end methods ===
    ...mapMutations('unfolding', [
      'revealUnfolding',
    ]),
    ...mapMutations('upgrades', [
      'setUpgrades',
      'resetUpgrades',
    ]),
    ...mapMutations('currency', [
      'resetCurrency',
      'addCurrencyData',
      'setCurrencyData',
    ]),
    ...mapMutations('statistics', [
      'addToStat',
      'setStatisticsData',
      'resetStatistics',
    ]),
    ...mapMutations('icons', [
      'resetIcons',
    ]),
    ...mapMutations('caffeine', [
      'resetCaffeine',
      'setCaffeineData',
      'activateCaffeine',
    ]),
    ...mapMutations('books', [
      'resetBooks',
      'setBooksData',
    ]),
    ...mapMutations('jobs', [
      'setJobsData',
      'resetJobs',
    ]),
    ...mapMutations('workers', [
      'setWorkers',
      'setWorkersData',
      'resetWorkers',
    ]),
    ...mapMutations('rebirth', [
      'setRebirthData',
      'addRebirthData',
    ]),
  },
};
</script>

<style lang="scss">
#game {
  text-align: center;
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
.stats {
  padding-top: 20px !important;
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
</style>
