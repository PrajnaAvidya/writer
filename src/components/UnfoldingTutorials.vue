<template>
  <div />
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'UnfoldingTutorials',
  data: () => ({
    tutorial: {},
    active: false,
  }),
  computed: {
    ...mapState('tutorials', [
      'tutorials',
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
  mounted() {
    // load first tutorial
    this.getNextTutorial();
  },
  methods: {
    checkTutorial() {
      // return if debug mode, active tutorial, or no tutorial
      if (this.checkDebug('disableUnfolding') || this.tutorial === undefined || this.active === true) {
        return;
      }

      // check if tutorial conditions are met
      if (this.tutorial.unlock.words && this.words.gte(this.tutorial.unlock.words)) {
        this.showTutorial();
      } else if (this.tutorial.unlock.money && this.money.gte(this.tutorial.unlock.money)) {
        this.showTutorial();
      } else if (this.tutorial.unlock.caffeine === true && this.buzzActive === true) {
        this.showTutorial();
      } else if (this.tutorial.unlock.job === true && this.jobsComplete.gt(0)) {
        this.showTutorial();
      } else if (this.tutorial.unlock.worker === true && this.workersHired.gt(0)) {
        this.showTutorial();
      }
    },
    showTutorial() {
      this.active = true;

      if (!this.tutorial.delay) {
        // open immediately
        this.revealTutorial();
      } else {
        // delay
        setTimeout(() => {
          this.revealTutorial();
        }, parseInt(1000 * this.tutorial.delay, 10));
      }
    },
    revealTutorial() {
      if (this.tutorial.reveal) {
        this.tutorial.reveal.forEach((reveal) => {
          this.revealUnfolding(reveal);
        });
      }

      if (this.tutorial.urgentJob) {
        this.$root.$emit('updateUrgentJob', true);
      }

      this.getNextTutorial();
    },
    getNextTutorial() {
      this.tutorial = this.tutorials.pop();
      this.active = false;
    },
    ...mapMutations('unfolding', [
      'revealUnfolding',
    ]),
  },
};
</script>
