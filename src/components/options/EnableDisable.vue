<template>
  <div
    class="option-item"
    :class="{tooltip}"
    :data-tooltip="tooltip"
  >
    <span class="option-label">
      {{ label }}:
    </span>
    <a
      class="button option-choice"
      :disabled="checkOption(optionIndex)"
      @click="setOptionData({index: optionIndex, value: true})"
    >
      Enable
    </a>
    <a
      class="button option-choice"
      :disabled="!checkOption(optionIndex)"
      @click="setOptionData({index: optionIndex, value: false})"
    >
      Disable
    </a>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'EnableDisable',
  props: {
    tooltip: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      required: true,
    },
    optionIndex: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('options', [
      'checkOption',
    ]),
  },
  methods: {
    ...mapMutations('options', [
      'setOptionData',
    ]),
  },
};
</script>
