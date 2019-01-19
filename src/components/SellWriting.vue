<template>
  <div class="sell-writing">
    <span class="writing-value">
      Writing Value: {{ writingValue | moneyCents }}
    </span>

    <a
      class="button"
      @click="$emit('sellWords')"
    >
      Sell Words
    </a>
  </div>
</template>

<script>
export default {
  name: 'SellWriting',
  props: {
    writingValue: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.writing-value {
  margin-right: 10px;
}
</style>
