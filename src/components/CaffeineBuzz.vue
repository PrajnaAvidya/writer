<template>
  <div class="caffeine">
    <div class="columns">
      <div class="column is-half">
        <a
          class="button caffeine-button"
          :disabled="buzzActive || coffeeAvailableTimer > 0"
          @click="$root.$emit('coffee', $event)"
        >
          <i
            class="fas fa-2x fa-coffee caffeine-icon"
          />
          <strong>
            Drink Coffee
          </strong>
        </a>
      </div>
      <div class="column is-half">
        <div class="caffeine-status">
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
  </div>
</template>

<script>
import unixTimestamp from '@/utils/unixTimestamp';
import { mapState } from 'vuex';

export default {
  name: 'CaffeineBuzz',
  data: () => ({
    coffeeAvailableTimer: 0,
    buzzRemaining: 0,
    interval: null,
  }),
  computed: {
    ...mapState([
      'buzzActive',
      'nextCaffeineTime',
      'endCaffeineTime',
      'caffeineTime',
      'caffeineCooldown',
    ]),
  },
  mounted() {
    this.interval = setInterval(() => this.updateTimer(), 250);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    updateTimer() {
      if (this.buzzActive) {
        this.buzzRemaining = parseInt((this.endCaffeineTime - unixTimestamp()) / 1000, 10);
        this.coffeeAvailableTimer = this.caffeineCooldown;
      } else {
        this.buzzRemaining = this.caffeineTime;
        this.coffeeAvailableTimer = parseInt((this.nextCaffeineTime - unixTimestamp()) / 1000, 10);
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
.caffeine-button {
  background-color: $blue;
  padding: 25px 15px;
}
.caffeine-icon {
  margin-right: 5px;
}
.caffeine-status {
  height: 52px;
  line-height: 52px;
}
</style>
