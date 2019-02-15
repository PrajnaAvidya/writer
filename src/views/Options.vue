<template>
  <div>
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

    <div
      class="option-item tooltip"
      data-tooltip="Disabling may improve performance on slower computers"
    >
      <span class="option-label">
        Currency Ticking Effect:
      </span>
      <a
        class="button option-choice"
        :disabled="loopEffect"
        @click="setOptionData({ index: 'loopEffect', value: true })"
      >
        Enable
      </a>
      <a
        class="button option-choice"
        :disabled="!loopEffect"
        @click="setOptionData({ index: 'loopEffect', value: false })"
      >
        Disable
      </a>
    </div>

    <!--a
      class="button is-danger"
    >
      Hard Reset
    </a-->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Options',
  computed: {
    ...mapState('options', [
      'buttonSize',
      'maxButtonSize',
      'loopEffect',
    ]),
  },
  methods: {
    ...mapMutations('options', [
      'setOptionData',
      'adjustButtonSize',
    ]),
  },
};
</script>

<style lang="scss" scoped>
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
