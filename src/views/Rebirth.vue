<template>
  <div>
    <div class="box">
      <div class="milestones is-size-3">
        Milestones: {{ milestones | round }}
      </div>
      <p class="text">
        Once you achieve {{ milestonesNeeded | round }} milestones you can rebirth and start from zero. Your words and milestones will be converted into <strong>plot points</strong> which will give you a bonus in the next life.
      </p>
      <p
        v-if="milestones.gte(milestonesNeeded)"
        class="text"
      >
        If you rebirth now you will recieve {{ milestones | round }} milestone plot points + {{ words.e | round }} word plot points for a total of <strong>{{ milestones.plus(words.e) | round }} plot points</strong>.
      </p>
      <a
        class="button is-danger"
        :disabled="!checkDebug('rebirth') && milestones.lt(milestonesNeeded)"
        @click="confirmRebirth()"
      >
        {{ buttonText }}
      </a>
    </div>
    <Transition name="fadeIn">
      <div
        v-if="doRebirth"
        class="rebirth"
      />
    </Transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import log from '@/utils/log';

export default {
  name: 'Rebirth',
  data: () => ({
    buttonText: 'Rebirth',
    doRebirth: false,
  }),
  computed: {
    milestonesNeeded() {
      return this.baseMilestonesNeeded.plus(this.rebirths);
    },
    ...mapState('currency', [
      'words',
      'milestones',
    ]),
    ...mapState('rebirth', [
      'rebirths',
      'baseMilestonesNeeded',
    ]),
    ...mapGetters('debug', [
      'checkDebug',
    ]),
  },
  methods: {
    confirmRebirth() {
      if (!this.checkDebug('rebirth') && this.milestones.lt(this.milestonesNeeded)) {
        return;
      }

      if (this.buttonText === 'Rebirth') {
        this.buttonText = 'Are You Sure?';
        setTimeout(() => {
          this.buttonText = 'Rebirth';
        }, 3000);
      } else {
        log('rebirth');
        document.title = 'REBIRTH!';
        this.doRebirth = true;
        this.$root.$emit('crazy');
        setTimeout(() => {
          this.$root.$emit('rebirth');
          this.doRebirth = false;
          this.buttonText = 'Rebirth';
          this.$router.push('/');
        }, 5000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.milestones {
  font-weight: bolder;
}
.rebirth {
  opacity: 1;
  background: #ddd;
  width: 100%;
  height: 100%;
  z-index: 99999999999;
  top: 0;
  left: 0;
  position: fixed;

  -webkit-animation-name: fadeIn;
  -webkit-animation-duration: 3s;
  animation-name: fadeIn;
  animation-duration: 3s;
}
@-webkit-keyframes fadeIn {
  0% { opacity: 0; }
  20% { opacity: 0.1; }
  40% { opacity: 0.5; }
  60% { opacity: 0.7; }
  80% { opacity: 0.8; }
  100% { opacity: 1; }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.3; }
  60% { opacity: 0.5; }
  80% { opacity: 0.9; }
  100% { opacity: 1; }
}
</style>
