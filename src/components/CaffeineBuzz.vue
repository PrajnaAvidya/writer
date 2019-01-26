<template>
  <div class="caffeine">
    <div class="columns">
      <div class="column is-half">
        <a
          class="button"
          :disabled="buzzActive || coffeeAvailableTimer > 0"
          @click="$root.$emit('coffee')"
        >
          Drink Coffee
        </a>
      </div>
      <div class="column is-half">
        <span v-if="buzzActive">
          Caffeine Buzz Remaining: {{ buzzRemaining }} seconds
        </span>
        <span v-else>
          <span v-if="coffeeAvailableTimer > 0">
            Coffee available in {{ coffeeAvailableTimer }} seconds
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import unixTimestamp from '@/utils/unixTimestamp';

export default {
  name: 'CaffeineBuzz',
  props: {
    buzzActive: Boolean,
    buzzRemaining: {
      type: Number,
      required: true,
    },
    caffeineNextAvailable: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    coffeeAvailableTimer: -1,
  }),
  mounted() {
    setInterval(() => this.updateTimer(), 250);
  },
  methods: {
    updateTimer() {
      this.coffeeAvailableTimer = parseInt(this.caffeineNextAvailable - unixTimestamp(), 10);
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
