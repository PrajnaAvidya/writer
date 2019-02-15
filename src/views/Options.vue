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

    <!--a
      class="button is-danger"
    >
      Hard Reset
    </a-->
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
  computed: {
    ...mapState('options', [
      'buttonSize',
      'maxButtonSize',
    ]),
  },
  methods: {
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
