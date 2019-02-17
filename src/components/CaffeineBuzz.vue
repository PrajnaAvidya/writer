<template>
  <div class="caffeine">
    <div class="columns">
      <div class="column is-half">
        <a
          class="button caffeine-button"
          :class="{ pulse: buzzActive }"
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
            <div
              v-if="coffeeAvailableTimer > 0"
              class="caffeine-cooldown tooltip is-tooltip-bottom"
              :data-tooltip="progressTooltip"
              @click="hurryCooldown()"
            >
              <progress
                class="progress is-info"
                :value="caffeineProgress"
                :max="caffeineCooldown * 1000"
              />
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import unixTimestamp from '@/utils/unixTimestamp';

export default {
  name: 'CaffeineBuzz',
  data: () => ({
    coffeeAvailableTimer: 0,
    buzzRemaining: 0,
    interval: null,
    caffeineProgress: 0,
    progressTooltip: '',
  }),
  computed: {
    ...mapState('caffeine', [
      'buzzActive',
      'nextCaffeineTime',
      'endCaffeineTime',
      'caffeineTime',
      'caffeineCooldown',
    ]),
  },
  mounted() {
    this.interval = setInterval(() => this.updateTimer(), 100);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    updateTimer() {
      const utimestamp = unixTimestamp();
      if (this.buzzActive) {
        this.buzzRemaining = parseInt((this.endCaffeineTime - utimestamp) / 1000, 10);
        this.coffeeAvailableTimer = this.caffeineCooldown;
        this.caffeineProgress = 0;
      } else {
        this.buzzRemaining = this.caffeineTime;
        this.coffeeAvailableTimer = parseInt((this.nextCaffeineTime - utimestamp) / 1000, 10);
        this.caffeineProgress = (1000 * this.caffeineCooldown) - (this.nextCaffeineTime - utimestamp);
        this.progressTooltip = `Coffee available in ${parseInt((this.nextCaffeineTime - utimestamp) / 1000, 10)} seconds`;
      }
    },
    hurryCooldown(id) {
      this.speedCaffeineCooldown();
    },
    ...mapMutations('caffeine', [
      'speedCaffeineCooldown',
    ]),
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
  font-size: 10pt;
  height: 52px;
  line-height: 52px;
}
.caffeine-cooldown {
  cursor: pointer;
  padding-left: 20px;
  padding-right: 20px;
  height: 43px;
  display: flex;
  align-items: center;
}
.progress {
  margin: 0;
}
</style>
