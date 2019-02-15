<template>
  <div>
    <!-- TODO make component -->
    <div
      class="option-item tooltip"
      data-tooltip="Change the size of the 'write' button"
    >
      <span class="option-label">
        Write Button Size:
      </span>
      <a
        class="button option-choice"
        :disabled="buttonSize <= 1"
        @click="adjustButtonSize(-1)"
      >
        Smaller
      </a>
      <a
        class="button option-choice"
        :disabled="buttonSize >= maxButtonSize"
        @click="adjustButtonSize(1)"
      >
        Bigger
      </a>
    </div>

    <EnableDisable
      label="Notifications"
      tooltip="Notifications make the game more fun!"
      option-index="notifications"
    />

    <EnableDisable
      label="Particle Effects"
      tooltip="Disable if you have an old graphics card or if you are boring"
      option-index="particles"
    />

    <EnableDisable
      label="Floating text Effect"
      tooltip="Disable if you have an old graphics card or if you are boring"
      option-index="floatingText"
    />

    <EnableDisable
      label="Currency Ticking Effect"
      tooltip="Disabling may improve performance on slower computers"
      option-index="loopEffect"
    />

    <a
      class="button is-danger"
      @click="hardReset()"
    >
      {{ resetButtonText }}
    </a>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import EnableDisable from '@/components/options/EnableDisable.vue';

export default {
  name: 'Options',
  components: {
    EnableDisable,
  },
  data: () => ({
    resetButtonText: 'Hard Reset',
  }),
  computed: {
    ...mapState('options', [
      'buttonSize',
      'maxButtonSize',
    ]),
  },
  methods: {
    hardReset() {
      if (this.resetButtonText === 'Hard Reset') {
        this.resetButtonText = 'Are You Sure?';
        setTimeout(() => {
          this.resetButtonText = 'Hard Reset';
        }, 3000);
      } else {
        const choice = window.confirm('Are you absolutely sure? This will completely wipe all of your progress (including rebirths/plot points) and you will recieve no bonus or hidden achievements or anything like that.');
        if (choice === true) {
          this.$root.$emit('hardReset');
        } else {
          this.resetButtonText = 'Hard Reset';
        }
      }
    },
    ...mapMutations('options', [
      'adjustButtonSize',
    ]),
  },
};
</script>

<style lang="scss" scoped>
// TODO remove styling when in components
.option-label, .option-choice {
  margin-right: 10px;
}
.option-label {
  font-weight: bold;
}
.option-item {
  height: 35px;
  line-height: 35px;
  margin-bottom: 20px;
}
</style>
