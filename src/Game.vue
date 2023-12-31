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

      <CreativeButtons ref="creative" />
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
import floatingText from '@/utils/floatingText';
import particles from '@/utils/particles';
// save/load
import save from '@/utils/saveLoad/save';
import load from '@/utils/saveLoad/load';
import deleteSave from '@/utils/saveLoad/deleteSave';
import saveUpgrade from '@/utils/saveLoad/upgrade';

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
  data: () => gameData,
  computed: {
    ...mapState('upgrades', [
      'purchasedUpgrades',
      'upgrades',
    ]),
    ...mapState('statistics', [
      'stats',
      'milestoneTargets',
      'milestoneCount',
      'statDescriptions',
    ]),
    ...mapState('currency', [
      'words',
      'money',
      'wordValue',
      'milestones',
      'totalWps',
    ]),
    ...mapState('icons', [
      'playerIcons',
    ]),
    ...mapState('caffeine', [
      'buzzActive',
      'caffeineTime',
      'nextCaffeineTime',
      'endCaffeineTime',
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
    ...mapState('managers', [
      'managers',
      'managerCosts',
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
      'checkBonus',
      'plotBonus',
    ]),
    ...mapGetters('options', [
      'checkOption',
    ]),
  },
  mounted() {
    this.setupGame();
  },
  methods: {
    async setupGame(rebirth = false) {
      if (rebirth) {
        this.rebirthGame();
        this.isNewGame = false;
      } else {
        const saveData = await localforage.getItem('writerSave');
        if (saveData && !this.checkDebug('disableAutoLoad')) {
          if (saveData.version === 1 || saveData.version === 2) {
            // these are broken/old savegames that are beyond salvaging at this point
            await deleteSave();
            window.location.reload(false);
          } else {
            await this.loadGame(saveData.timestamp);
            if (saveUpgrade(saveData)) {
              // save and reload after upgrading
              await save();
              window.location.reload(false);
            }
          }
        } else {
          await this.newGame();
        }
      }

      // go home
      if (!this.checkDebug('enabled')) {
        this.$router.push('/');
      }

      // disable crazy books
      this.crazyBooksComponent = null;

      // check for debug mode
      this.setDebugMode();

      // start game
      this.particles = particles();
      this.calculateWorkerCosts(true);
      this.calculateManagerCosts();
      this.updateWps();

      // save everything before starting ticks
      await save();
      this.nextSave = unixTimestamp(this.saveInterval);
      this.nextManagerUpdate = unixTimestamp(this.bonuses.managerHiringTimer);

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
          const offlineWords = this.totalWps.times(timeDifference).times(0.5);
          this.addWords(offlineWords);
          log(`applied offline earnings for ${timeDifference} seconds: ${this.$options.filters.round(offlineWords)} words`);
        }

        // register events
        this.registerEvents();
      });
    },
    async newGame() {
      log('new game');
      this.$ga.event({
        eventCategory: 'Game',
        eventAction: 'New',
        eventLabel: this.utimestamp,
      });

      // enable tutorials/unfolding
      this.unfoldingComponent = 'UnfoldingTutorials';
      this.loadFirstTutorial = true;

      this.setNextBook();
      this.updateJobs(true);

      // register events
      this.registerEvents();
    },
    rebirthGame() {
      this.$ga.event({
        eventCategory: 'Game',
        eventAction: 'Rebirth',
        eventLabel: `Rebirths: ${this.rebirths}`,
      });

      // show bonus panel
      this.revealUnfolding('showBonus');

      this.setNextBook();
      this.updateJobs(true);
    },
    async hardReset() {
      this.hardResetting = true;

      await deleteSave();

      window.location.reload(false);
    },
    setDebugMode() {
      if (this.checkDebug('enabled')) {
        const debugSettings = this.$store.state.debug;

        if (this.isNewGame) {
          if (debugSettings.startingMilestones) {
            this.setCurrencyData({ index: 'milestones', value: debugSettings.startingMilestones });
          }
          if (debugSettings.startingWords) {
            this.setCurrencyData({ index: 'words', value: debugSettings.startingWords });
          }
          if (debugSettings.startingMoney) {
            this.setCurrencyData({ index: 'money', value: debugSettings.startingMoney });
          }
          if (debugSettings.startingPlotPoints) {
            this.setRebirthData({ index: 'plotPoints', value: debugSettings.startingPlotPoints });
          }
        }

        if (debugSettings.fastSaves) {
          this.saveInterval = 3;
        }
        if (debugSettings.jobCooldown || debugSettings.jobCooldown === 0) {
          this.setJobsData({ index: 'jobCooldown', value: debugSettings.jobCooldown });
        }
        if (debugSettings.caffeineTime) {
          this.setCaffeineData({ index: 'caffeineTime', value: debugSettings.caffeineTime });
        }
        if (debugSettings.caffeineCooldown) {
          this.setCaffeineData({ index: 'caffeineCooldown', value: debugSettings.caffeineCooldown });
        }
        if (this.checkDebug('urgentJobs')) {
          this.revealUnfolding('firstUrgentJob');
          this.setJobsData({ index: 'urgentJobMinimumTime', value: 1 });
          this.setJobsData({ index: 'urgentJobMaximumTime', value: 1 });
        }
        if (this.checkDebug('books')) {
          this.setBooksData({ index: 'bookMinimumTime', value: 1 });
          this.setBooksData({ index: 'bookMaximumTime', value: 1 });
          this.setNextBook();
        }
        if (this.checkDebug('disableUnfolding')) {
          this.revealUnfolding('firstUrgentJob');
          this.revealUnfolding('firstJobComplete');
          this.setNextUrgentJob();
        }
      }
    },
    registerEvents() {
      log('registering events');
      // save before closing window
      window.addEventListener('beforeunload', () => {
        if (!this.unloadSave && !this.hardResetting && !this.checkDebug('disableAutoSave')) {
          this.unloadSave = true;
          save();
        }
      });
      window.addEventListener('unload', () => {
        if (!this.unloadSave && !this.hardResetting && !this.checkDebug('disableAutoSave')) {
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
      this.$root.$on('hireManager', this.hireManager);
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
      this.$root.$on('hardReset', this.hardReset);
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
      this.checkUpgrades();
      this.updateMilestones();
      this.updateJobs();
      this.updateUrgentJob();
      this.updateManagers();

      // how much to divide progress for current tick
      this.frameIncrement = Big(1).div(Big(1000).div(progress));

      if (this.totalWps.gt(0)) {
        const frameWords = this.totalWps.times(this.frameIncrement);

        this.addWords(frameWords);
      }

      // update title
      this.updateTitle();

      if (!this.checkDebug('disableAutoSave') && this.utimestamp >= this.nextSave && !this.hardResetting) {
        save();
        this.nextSave = unixTimestamp(this.saveInterval);
      }

      // do loop effect
      this.loopEffect(this.frameIncrement);

      // get next frame
      window.requestAnimationFrame(this.tick);
    },
    // === end global update loop ===

    // === start methods ===
    // ui/effects
    loopEffect(frameIncrement) {
      if (!this.checkOption('loopEffect')) {
        this.displayedWords = Big(this.words);
        this.displayedMoney = Big(this.money);
      }

      const loopAmount = frameIncrement.times(11);

      if (this.words.eq(0)) {
        this.displayedWords = Big(0);
      } else {
        const wordDiff = this.words.minus(this.displayedWords);
        if (wordDiff.abs().lte(1) || wordDiff.abs().div(this.words).lt(0.01)) {
          this.displayedWords = Big(this.words);
        } else {
          this.displayedWords = this.displayedWords.plus(wordDiff.times(loopAmount));
        }
      }

      if (this.money.eq(0)) {
        this.displayedMoney = Big(0);
      } else {
        const moneyDiff = this.money.minus(this.displayedMoney);
        if (moneyDiff.abs().lte(1) || moneyDiff.abs().div(this.money).lt(0.01)) {
          this.displayedMoney = Big(this.money);
        } else {
          this.displayedMoney = this.displayedMoney.plus(moneyDiff.times(loopAmount));
        }
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
      let words = this.plotBonus;
      if (this.buzzActive) {
        words = words.plus(this.workerWps.div(2)).gt(this.caffeineMinimumWordGeneration / 2) ? words.plus(this.workerWps.div(2)) : this.caffeineMinimumWordGeneration / 2;
        this.particles.spawnParticle(event.pageX - 5, event.pageY - 20);
      }
      this.addToStat({ stat: 'clickWords', amount: words });
      this.addWords(words, true);

      // show floating + animation
      floatingText({
        x: event.pageX - 5,
        y: event.pageY - 20,
        text: `+${this.$options.filters.round(words)}`,
        time: 500,
        height: 150,
        disappearFrom: 0.25,
      });
    },
    // caffeine
    coffee(event, force = false) {
      if (force || this.utimestamp >= this.nextCaffeineTime) {
        if (event) {
          // capture player mouse position
          this.caffeineX = event.pageX - 5;
          this.caffeineY = event.pageY - 20;
        }

        this.updateWps();
        this.activateCaffeine(force);

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
        } else if (this.utimestamp >= this.caffeineAnimationNext && (!this.checkBonus('autoCaffeine') || (this.checkBonus('autoCaffeine') && !this.checkOption('autoCaffeine')))) {
          this.particles.spawnParticle(this.caffeineX, this.caffeineY);
          // show animation
          floatingText({
            x: this.caffeineX,
            y: this.caffeineY,
            text: `+${this.$options.filters.round(this.caffeineAnimationAmount.times(this.plotBonus))}`,
            time: 500,
            height: 150,
            disappearFrom: 0.25,
          });
          this.caffeineAnimationNext = parseInt(this.utimestamp, 10) + parseInt(this.caffeineAnimationInterval, 10);
        }
      } else if (!this.buzzActive && this.checkBonus('autoCaffeine') && this.checkOption('autoCaffeine') && this.nextCaffeineTime <= this.utimestamp) {
        this.coffee();
      }
    },
    // caffeine animation
    caffeineAnimationParams() {
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

      /*
      this.$ga.event({
        eventCategory: 'Workers',
        eventAction: 'Hired',
        eventLabel: `${this.buyAmount} ${this.workers[id].pluralName}`,
      });
      */
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
    updateWps() {
      log('recalculating wps');
      // get worker wps
      const oldWps = Big(this.workerWps);
      const workerWps = calculateWorkerWps(this.workers);
      // add plot point bonus
      let totalWps = workerWps.total.times(this.plotBonus);
      // add caffeine wps
      if (this.buzzActive) {
        // apply plot bonus econd time for caffeine
        const wordGeneration = Big(this.bonuses.caffeineWordMultiplier).times(totalWps).times(this.plotBonus);
        const minimumWordGeneration = Big(this.caffeineMinimumWordGeneration).times(this.bonuses.caffeineWordMultiplier);
        this.caffeineWordGeneration = wordGeneration.gt(minimumWordGeneration) ? wordGeneration : minimumWordGeneration;
        totalWps = totalWps.plus(this.caffeineWordGeneration);
        this.caffeineAnimationParams();
      }
      this.setCurrencyData({ index: 'totalWps', value: totalWps });
      this.setWorkersData({ index: 'workerWps', value: workerWps.total.times(this.plotBonus) });
      this.setWorkersData({ index: 'workerTooltips', value: workerWps.tooltips });
      this.setWorkersData({ index: 'individualWorkerWps', value: workerWps.worker });

      this.$refs.creative.writeTooltip();
      this.updateJobWords(oldWps);
    },
    checkUpgrades() {
      if (this.utimestamp >= this.nextUpgradeCheck) {
        Object.keys(this.upgrades).forEach((upgradeId) => {
          const upgrade = this.upgrades[upgradeId];
          if (!upgrade.revealed && (
            (upgrade.type !== 'worker' && !upgrade.previousId && this.money.gte(upgrade.cost.div(10)))
            || (upgrade.type === 'worker' && !upgrade.previousId && (!this.workers[upgrade.workerId] || this.workers[upgrade.workerId].quantity > 0))
            || (upgrade.previousId && (this.purchasedUpgrades.includes(parseInt(upgrade.previousId, 10)) || this.purchasedUpgrades.includes(upgrade.previousId))))) {
            this.$set(this.upgrades[upgradeId], 'revealed', true);
          }
        });
        this.nextUpgradeCheck = unixTimestamp(0.5);
      }
    },
    removeUpgrade(upgradeId) {
      this.addToStat({ stat: 'upgrades', amount: 1 });
      const newUpgrades = this.upgrades;
      this.$delete(newUpgrades, upgradeId);
      this.setUpgrades(newUpgrades);
      this.updateWps();
    },
    // managers
    hireManager(workerId) {
      // check if can afford
      if (this.money.lt(this.managerCosts[workerId])) {
        return;
      }

      // buy & increment
      this.subtractMoney(this.managerCosts[workerId]);
      this.managers[workerId] += 1;
      this.addToStat({ stat: 'managers', amount: 1 });

      // recalculate stuff
      this.calculateManagerCosts();

      /*
      this.$ga.event({
        eventCategory: 'Manager',
        eventAction: 'Hired',
        eventLabel: `${this.workers[workerId].pluralName}`,
      });
      */
    },
    calculateManagerCosts() {
      log('recalculating manager costs');
      Object.keys(this.workers).forEach((workerId) => {
        this.managerCosts[workerId] = workerCost(Big(1E6).times(this.workers[workerId].baseCost), this.managers[workerId], this.workers[workerId].costMultiplier * 10, 1);
      });
    },
    updateManagers() {
      if (this.utimestamp >= this.nextManagerUpdate) {
        let hired = 0;
        Object.keys(this.workers).forEach((workerId) => {
          if (this.managers[workerId] > 0) {
            this.workers[workerId].managerHired += this.managers[workerId] * this.bonuses.managerHiringAmount;
            hired += this.managers[workerId];
          }
        });

        if (hired > 0) {
          log(`${hired} workers hired by managers`);
          this.updateWps();

          /*
          this.$ga.event({
            eventCategory: 'Manager',
            eventAction: `Hired ${hired} Workers`,
            eventLabel: hired,
          });
          */
        }
        this.nextManagerUpdate = unixTimestamp(this.bonuses.managerHiringTimer);
      }
    },
    // jobs
    updateJobs(initial = false) {
      if (!initial && this.utimestamp < this.nextJobCheck) {
        return;
      }

      for (let jobId = 1; jobId <= this.bonuses.jobSlots; jobId += 1) {
        // generate new job right away when complete
        if (initial || !this.jobs[jobId] || this.jobs[jobId].completed === true) {
          this.setJob({ id: jobId, job: generateJob(this.wordValue, this.workerWps, jobId) });
          if (initial) {
            this.jobs[jobId].currentPayment = this.jobs[jobId].payment;
          }
        }

        // update available based on timestamp
        this.$set(this.jobAvailable, jobId, initial || this.utimestamp >= this.jobsAvailableTimestamps[jobId]);
      }

      this.lastJobCheck = unixTimestamp();
      this.nextJobCheck = unixTimestamp(0.1);
    },
    updateJobWords(oldWps) {
      if (this.workerWps.eq(oldWps)) {
        return;
      }

      let adjustment;
      if (oldWps.eq(0)) {
        adjustment = Big(1).plus(this.workerWps.div(40));
      } else {
        adjustment = Big(1).plus((this.workerWps.div(oldWps).minus(1)).div(4));
      }

      for (let jobId = 1; jobId <= this.bonuses.jobSlots; jobId += 1) {
        // only update pending jobs
        if (!this.jobAvailable[jobId] && this.jobs[jobId]) {
          this.jobs[jobId].words = this.jobs[jobId].words.times(adjustment);
          this.jobs[jobId].payment = this.jobs[jobId].payment.times(adjustment);
        }
      }
    },
    // urgent jobs
    updateUrgentJob(force = false) {
      if (force || (this.checkUnfolding('firstUrgentJob') && !this.urgentJobActive && this.utimestamp >= this.urgentJobTimestamp)) {
        log('enabling urgent job');
        if (force === true) {
          // update end time for forced jobs
          this.setJobsData({ index: 'urgentJobExpiration', value: unixTimestamp(this.urgentJobTimer) });
        }
        // generate urgent job
        this.setJobsData({ index: 'urgentJob', value: generateUrgentJob(this.words, this.wordValue, this.workerWps) });
        this.setJobsData({ index: 'urgentJobActive', value: true });
      } else if (this.urgentJobActive) {
        if (this.utimestamp >= this.urgentJobExpiration) {
          log('urgent job expired');
          this.setJobsData({ index: 'urgentJobActive', value: false });
          if (this.urgentJobNotification) {
            this.urgentJobNotification.close();
            this.urgentJobNotification = null;
          }
          this.setNextUrgentJob();
        } else {
          // update countdowns
          this.setJobsData({ index: 'urgentJobCountdown', value: parseInt(((this.urgentJobExpiration) - this.utimestamp) / 1000, 10) });
          if (!this.urgentJobNotification && this.checkOption('notifications')) {
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
          if (this.checkOption('notifications')) {
            this.urgentJobNotification.setText(notifyIconText(`<strong>Urgent Job!</strong><br>${this.urgentJobCountdown} seconds left to accept`, 'fa-bullhorn'));
          }
        }
      }
    },
    setNextUrgentJob() {
      const time = randomInt(this.urgentJobMinimumTime, this.urgentJobMaximumTime);
      if (this.urgentJobNotification) {
        this.urgentJobNotification.close();
        this.urgentJobNotification = null;
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
            x: Math.floor(Math.random() * (document.body.offsetWidth - 50)),
            y: Math.floor(Math.random() * (document.body.offsetHeight - 50)),
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
    addMoney(money) {
      // add money
      this.addCurrencyData({ index: 'money', amount: money });
      this.addToStat({ stat: 'money', amount: money });
    },
    subtractMoney(money) {
      // subtract money
      this.addCurrencyData({ index: 'money', amount: money.times(-1) });
      if (this.money.lt(0)) {
        this.setCurrencyData({ index: 'money', value: Big(0) });
      }
    },
    addWords(words) {
      this.addCurrencyData({ index: 'words', amount: words });
      this.addToStat({ stat: 'words', amount: words });

      if (this.checkBonus('passiveMoney')) {
        this.addMoney(words.times(this.jobRewardMultiplier).times(this.bonuses.passiveMoneyAmount));
      }
    },
    subtractWords(words) {
      this.addCurrencyData({ index: 'words', amount: words.times(-1) });
      if (this.words.lt(0)) {
        this.setCurrencyData({ index: 'words', value: Big(0) });
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
          notify(`Milestone Completed: ${this.statDescriptions[stat]}`, {
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

      if (this.milestones.gte(15)) {
        this.revealUnfolding('showRebirth');
      }
      if (!this.rebirthNotification && this.milestones.gte(this.baseMilestonesNeeded + (this.rebirths * 2))) {
        notify('Rebirth Ready', {
          type: 'alert',
          icon: 'fa-recycle',
          timeout: false,
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
      Noty.closeAll();

      // update rebirth data
      this.addRebirthData({ index: 'plotPoints', amount: this.milestones });
      this.addRebirthData({ index: 'plotPoints', amount: this.words.e });
      this.addRebirthData({ index: 'rebirths', amount: 1 });

      // reload relevant vuex stores
      this.resetCurrency();
      this.resetStatistics();
      this.resetCaffeine();
      this.resetBooks();
      this.resetJobs();
      this.resetWorkers();
      this.resetUpgrades();
      this.resetManagers();

      // load next icon if exists
      const icon = this.playerIcons.pop();
      if (icon) {
        this.setIconData({ index: 'playerIcon', value: icon });
      }

      // reload game data
      Object.assign(this.$data, gameData);
      this.displayedWords = Big(0);
      this.displayedMoney = Big(0);

      // set starting money
      this.addMoney(this.bonuses.startingMoney);

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
      'setIconData',
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
      'setJob',
      'resetJobs',
    ]),
    ...mapMutations('workers', [
      'setWorkers',
      'setWorkersData',
      'resetWorkers',
    ]),
    ...mapMutations('managers', [
      'resetManagers',
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
.upgrade-text {
  margin-bottom: 10px;
}
</style>
