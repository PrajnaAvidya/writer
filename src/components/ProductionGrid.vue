<template>
  <div>
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
            class="button buy-button"
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

export default {
  name: 'ProductionGrid',
  data: () => ({
    previousAssignments: {},
    slider: {
      lineHeight: 8,
      processStyle: {
        backgroundColor: '#3273DC',
      },
      tooltipStyles: {
        backgroundColor: '#3273DC',
        borderColor: '#3273DC',
        color: '#3273DC',
      },
    },
  }),
  computed: {
    ...mapState([
      'buyAmount',
      'buyAmountIndex',
      'workers',
      'assignments',
      'workerWps',
      'individualWorkerWps',
    ]),
    ...mapGetters([
      'money',
    ]),
  },
  watch: {
    assignments: {
      handler(val) {
        Object.keys(this.assignments).forEach((workerId) => {
          if (this.assignments[workerId] !== this.previousAssignments[workerId]) {
            const balance = val[workerId];

            // send new balance value to Game
            this.$root.$emit('updateWorkerBalance', { workerId, balance });

            this.previousAssignments[workerId] = val[workerId];
          }
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.previousAssignments = Object.assign({}, this.assignments);
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
