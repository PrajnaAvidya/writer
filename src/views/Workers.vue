<template>
  <div class="home">
    <BuyAmounts />

    <div
      v-for="worker in workers"
      :key="worker.id"
      class="production"
      :class="{ 'is-hidden': !showWorker(worker) }"
    >
      <div class="columns">
        <div class="buy-column">
          <a
            :disabled="worker.costs[buyAmountIndex].gt(money)"
            class="button buy-button tooltip"
            :data-tooltip="workerTooltips[worker.id]"
            @click="$root.$emit('hireWorker', worker.id)"
          >
            <i
              class="fas fa-2x worker-icon"
              :class="worker.icon"
            />
            <span v-if="buyAmount === 1">
              <strong>Hire {{ worker.name }}</strong>
            </span>
            <span v-else>
              <strong>Hire {{ buyAmount }} {{ worker.pluralName }}</strong>
            </span>
          </a>
        </div>
        <div class="cost-column">
          Cost {{ worker.costs[buyAmountIndex] | money }} for {{ buyAmount }}
        </div>
        <div class="stats-column">
          <span v-if="worker.quantity > 0">
            <strong>{{ worker.pluralName }}: {{ worker.quantity | round }}</strong>
            <br>
            Words per Second: {{ individualWorkerWps[worker.id] | round }} ({{ workerWpsPercent(worker) | round }}%)
          </span>
        </div>
      </div>
      <hr>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Big from 'big.js';
import BuyAmounts from '@/components/BuyAmounts.vue';

export default {
  name: 'Workers',
  components: {
    BuyAmounts,
  },
  computed: {
    ...mapState('currency', [
      'money',
    ]),
    ...mapState('workers', [
      'buyAmount',
      'buyAmountIndex',
      'workers',
      'workerWps',
      'individualWorkerWps',
      'workerTooltips',
    ]),
    ...mapState('rebirth', [
      'plotPoints',
    ]),
  },
  methods: {
    showWorker(worker) {
      return worker.id === 'child' || this.workers[worker.previousId].quantity >= 5;
    },
    workerWpsPercent(worker) {
      return this.individualWorkerWps[worker.id].div(this.workerWps).times(Big(1).plus(this.plotPoints.div(100))).times(100);
    },
  },
};
</script>

<style lang="scss">
.production {
  padding-top: 10px;
  margin: 0 auto;
  width: 800px;
}
.not-hired {
  margin-top: -5px;
  margin-bottom: -5px;
}
.worker-icon {
  margin-right: 10px;
}
.buy-button {
  padding: 25px 15px;
  background-color: $blue;
}
.buy-button[disabled] {
  background-color: $blue;
}
.buy-column {
  width: 280px;
}
.cost-column {
  width: 330px;
}
.stats-column {
  width: 290px;
}
</style>
