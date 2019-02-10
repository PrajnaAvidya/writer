<template>
  <div />
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import log from '@/utils/log';

export default {
  name: 'UnfoldingTutorials',
  data: () => ({
    active: false,
  }),
  computed: {
    ...mapState('tutorials', [
      'tutorials',
      'currentTutorial',
    ]),
    ...mapState('currency', [
      'money',
      'words',
    ]),
    ...mapState('caffeine', [
      'buzzActive',
    ]),
    ...mapGetters('debug', [
      'checkDebug',
    ]),
    ...mapGetters('jobs', [
      'jobsComplete',
    ]),
    ...mapGetters('workers', [
      'workersHired',
    ]),
  },
  watch: {
    words() {
      this.checkTutorial();
    },
    money() {
      this.checkTutorial();
    },
    buzzActive() {
      this.checkTutorial();
    },
    jobsComplete() {
      this.checkTutorial();
    },
    workersHired() {
      this.checkTutorial();
    },
  },
  methods: {
    checkTutorial() {
      // return if debug mode, active tutorial, or no tutorial
      if (this.checkDebug('disableUnfolding') || this.currentTutorial === null || this.active === true) {
        return;
      }

      // check if tutorial conditions are met
      if (
        (this.currentTutorial.unlock.words && this.words.gte(this.currentTutorial.unlock.words))
        || (this.currentTutorial.unlock.money && this.money.gte(this.currentTutorial.unlock.money))
        || (this.currentTutorial.unlock.caffeine === true && this.buzzActive === true)
        || (this.currentTutorial.unlock.job === true && this.jobsComplete.gt(0))
        || (this.currentTutorial.unlock.worker === true && this.workersHired.gt(0))
      ) {
        this.showTutorial();
      }
    },
    showTutorial() {
      this.active = true;

      if (!this.currentTutorial.delay) {
        // open immediately
        this.revealTutorial();
      } else {
        // delay
        setTimeout(() => {
          this.revealTutorial();
        }, parseInt(1000 * this.currentTutorial.delay, 10));
      }
    },
    revealTutorial() {
      if (this.currentTutorial.reveal) {
        this.currentTutorial.reveal.forEach((reveal) => {
          this.revealUnfolding(reveal);
        });
      }

      if (this.currentTutorial.urgentJob) {
        this.$root.$emit('updateUrgentJob', true);
      }

      this.getNextTutorial();
    },
    getNextTutorial(loadedTutorial = null) {
      const tutorial = loadedTutorial || this.tutorials.pop();
      this.saveTutorial(tutorial);
      if (!tutorial) {
        log('tutorials complete');
        this.$root.$emit('endUnfolding');
      }
      this.active = false;
    },
    ...mapMutations('unfolding', [
      'revealUnfolding',
    ]),
    ...mapMutations('tutorials', [
      'saveTutorial',
    ]),
  },
};
</script>
