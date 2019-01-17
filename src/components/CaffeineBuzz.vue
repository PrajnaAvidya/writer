<template>
  <div class="caffeine columns">
    <div class="column is-half">
      <a
        class="button"
        @click="$emit('coffee')"
      >
        Drink Coffee ($2)
      </a>
    </div>
    <div class="column is-half">
      <span v-if="buzzActive">
        Caffeine Buzz Remaining: {{ buzzRemaining }} seconds
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CaffeineBuzz',
  props: {
    buzzActive: Boolean,
    buzzRemaining: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.caffeine {
  margin: 0 auto;
  width: 700px;
}
</style>
