<template>
  <div>
    <div class="option-item">
      Change Writing Button Size:
      <a
        class="button"
        :disabled="buttonSize <= 1"
        @click="changeButtonSize(-1)"
      >
        Smaller
      </a>
      &nbsp;
      <a
        class="button"
        :disabled="buttonSize >= maxButtonSize"
        @click="changeButtonSize(1)"
      >
        Bigger
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
    ]),
  },
  methods: {
    changeButtonSize(amount) {
      this.adjustButtonSize(amount);
    },
    ...mapMutations('options', [
      'adjustButtonSize',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.option-item {
  height: 35px;
  line-height: 35px;
}
</style>
