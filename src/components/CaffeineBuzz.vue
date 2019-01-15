<template>
  <div class="caffeine columns">
    <div class="column is-half">
      <a class="button" @click="$emit('coffee')">Drink Coffee</a>
    </div>
    <div class="column is-half">
      <span v-if="buzzActive">Caffeine Buzz Remaining: {{ buzzRemaining }} seconds</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'caffeine-buzz',
  props: {
    buzzActive: Boolean,
    buzzRemaining: Number,
  },
};
</script>

<style lang="scss" scoped>
.caffeine {
  margin: 0 auto;
  width: 700px;
}
</style>
