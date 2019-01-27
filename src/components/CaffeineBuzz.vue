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
import { mapState } from 'vuex';

export default {
  name: 'CaffeineBuzz',
  props: {
    buzzActive: Boolean,
  },
  data: () => ({
    coffeeAvailableTimer: 0,
    buzzRemaining: 0,
  }),
  computed: {
    ...mapState([
      'nextCaffeineTime',
      'endCaffeineTime',
    ]),
  },
  mounted() {
    setInterval(() => this.updateTimer(), 250);
  },
  methods: {
    updateTimer() {
      if (this.buzzActive) {
        this.buzzRemaining = parseInt(this.endCaffeineTime - unixTimestamp(), 10);
        this.coffeeAvailableTimer = 0;
      } else {
        this.buzzRemaining = 0;
        this.coffeeAvailableTimer = parseInt(this.nextCaffeineTime - unixTimestamp(), 10);
      }
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
