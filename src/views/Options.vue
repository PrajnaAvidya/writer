<template>
  <div>
    <div
      class="option-item tooltip"
      data-tooltip="Change the size of the 'write' button"
    >
      Change Writing Button Size:
      <a
        class="button"
        :disabled="buttonSize <= 1"
        @click="adjustButtonSize(-1)"
      >
        Smaller
      </a>
      &nbsp;
      <a
        class="button"
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
      Currency Ticking Effect:
      <a
        class="button"
        :disabled="loopEffect"
        @click="setOptionData({ index: 'loopEffect', value: true })"
      >
        Enable
      </a>
      &nbsp;
      <a
        class="button"
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
.option-item {
  height: 35px;
  line-height: 35px;
  margin-bottom: 20px;
}
</style>
