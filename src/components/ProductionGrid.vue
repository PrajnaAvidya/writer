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
            :disabled="worker.cost.gt(money)"
            class="button"
            @click="$root.$emit('hireWorker', worker.id)"
          >
            <span v-if="buyAmount === 1">
              Hire {{ worker.name }}
            </span>
            <span v-else>
              Hire {{ buyAmount }} {{ worker.pluralName }}
            </span>
          </a>
        </div>
        <div class="column">
          Cost {{ worker.cost | money }} for {{ buyAmount }}
        </div>
        <div class="column">
          <span v-if="worker.quantity > 0">
            {{ worker.pluralName }}: {{ worker.quantity | round }}
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
      'workers',
      'assignments',
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
</style>
