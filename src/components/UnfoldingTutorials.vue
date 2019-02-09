<template>
  <BaseModal
    ref="modal"
    :show-header="false"
    :show-footer="false"
    @close="getNextTutorial()"
  >
    <div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="tutorial ? tutorial.text : ''" />
    </div>
    <button
      class="button is-primary"
      @click="closeAndGetNextTutorial()"
    >
      OK
    </button>
  </BaseModal>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import BaseModal from '@/components/Modals/BaseModal.vue';

export default {
  name: 'UnfoldingTutorials',
  components: {
    BaseModal,
  },
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
      if (this.checkDebug('disableTutorials') || this.tutorial === undefined || this.active === true) {
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

      // show modal
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

      if (this.tutorial.text) {
        this.$refs.modal.open();
      } else {
        this.getNextTutorial();
      }
    },
    getNextTutorial() {
      this.tutorial = this.tutorials.pop();
      this.active = false;
    },
    closeAndGetNextTutorial() {
      this.$refs.modal.close();
      this.getNextTutorial();
    },
    ...mapMutations('unfolding', [
      'revealUnfolding',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.button {
  margin-top: 10px;
}
</style>
