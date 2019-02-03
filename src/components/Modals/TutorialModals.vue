<template>
  <BaseModal
    ref="modal"
    :show-header="false"
    :show-footer="false"
    :click-to-close="true"
    @close="getNextTutorial()"
  >
    <div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="tutorial ? tutorial.text : ''" />
    </div>
  </BaseModal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import BaseModal from '@/components/Modals/BaseModal.vue';

export default {
  name: 'TutorialModals',
  components: {
    BaseModal,
  },
  data: () => ({
    tutorial: {},
    active: false,
  }),
  computed: {
    ...mapState([
      'tutorials',
      'currency',
      'buzzActive',
    ]),
    ...mapGetters([
      'money',
      'words',
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
  },
  mounted() {
    // load first tutorial
    this.getNextTutorial();
  },
  methods: {
    checkTutorial() {
      // check if there's a tutorial to show or already about to show one
      if (this.tutorial === undefined || this.active === true) {
        return;
      }

      // check if tutorial conditions are met
      if (this.tutorial.unlock.words && this.words.gte(this.tutorial.unlock.words)) {
        this.showTutorial();
      } else if (this.tutorial.unlock.caffeine === true && this.buzzActive === true) {
        this.showTutorial();
      }
    },
    showTutorial() {
      this.active = true;

      // show modal
      if (this.tutorial.delay) {
        // delay
        setTimeout(() => this.$refs.modal.open(), parseInt(1000 * this.tutorial.delay, 10));
      } else {
        // open immediately
        this.$refs.modal.open();
      }
    },
    getNextTutorial() {
      this.tutorial = this.tutorials.pop();
      this.active = false;
      console.log(this.tutorial);
    },
  },
};
</script>
