<template>
  <div class="home">
    <BuyAmounts />

    <div
      v-for="worker in workers"
      :key="worker.id"
      class="production"
      :class="{ 'is-hidden': !showWorker(worker) }"
    >
      <div
        slot="title"
        class="columns"
      >
        <div class="column">
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
        <div class="column">
          Cost {{ worker.costs[buyAmountIndex] | money }} for {{ buyAmount }}
        </div>
        <div class="column">
          <span v-if="worker.quantity > 0">
            <strong>{{ worker.pluralName }}: {{ worker.quantity | round }}</strong>
            <br>
            Words per Second: {{ individualWorkerWps[worker.id] | round }} ({{ individualWorkerWps[worker.id].div(workerWps).times(100) | roundDecimal }}%)
          </span>
        </div>
      </div>
      <hr>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
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
  },
  methods: {
    showWorker(worker) {
      return worker.id === 'child' || this.workers[worker.previousId].quantity >= 5;
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
</style>
