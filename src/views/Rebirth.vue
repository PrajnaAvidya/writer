<template>
  <div>
    <div class="box">
      <div class="milestones is-size-3">
        Milestones: {{ currency.milestones | round }}
      </div>
      <p class="text">
        Once you hit {{ milestonesNeeded | round }} milestones you can rebirth and start from zero. Your milestones will be converted into <strong>plot points</strong> which will give you a bonus in the next life.
      </p>
      <a
        class="button is-danger"
        :disabled="currency.milestones.lt(milestonesNeeded)"
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
import { mapState } from 'vuex';
import log from '@/utils/log';

export default {
  name: 'Rebirth',
  data: () => ({
    buttonText: 'Rebirth',
    doRebirth: false,
  }),
  computed: {
    milestonesNeeded() {
      return this.rebirth.baseMilestonesNeeded.plus(this.rebirth.rebirths);
    },
    ...mapState('game', [
      'currency',
      'rebirth',
    ]),
  },
  methods: {
    confirmRebirth() {
      if (this.currency.milestones.lt(this.milestonesNeeded)) {
        return;
      }

      if (this.buttonText === 'Rebirth') {
        this.buttonText = 'Are You Sure?';
      } else {
        log('rebirth');
        this.doRebirth = true;
        setTimeout(() => {
          this.$root.$emit('rebirth');
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
.text {
  margin: 10px;
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
  -webkit-animation-duration: 1s;
  animation-name: fadeIn;
  animation-duration: 1s;
}
@-webkit-keyframes fadeIn {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.3; }
  60% { opacity: 0.5; }
  80% { opacity: 0.9; }
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
