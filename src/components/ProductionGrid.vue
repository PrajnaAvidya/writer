<template>
  <div>
    <div
      v-for="worker in workers"
      :key="worker.id"
      class="production"
    >
      <div class="columns">
        <div class="column">
          <a
            class="button"
            @click="$emit('hireWorker', worker.id)"
          >
            Hire {{ worker.name }}
          </a>
        </div>
        <div class="column">
          Cost {{ worker.cost | money }} for {{ buyAmount }}
        </div>
        <div class="column">
          <span v-if="worker.count > 0">
            {{ worker.plural }}: {{ worker.count | round }}
          </span>
        </div>
      </div>

      <div
        v-if="worker.count > 0"
        class="columns worker-balance"
      >
        <div class="column">
          Ideas: {{ 10 * (10 - assignments[worker.id]) }}%
        </div>
        <div class="column">
          <VueSlideBar
            v-model="assignments[worker.id]"
            :min="0"
            :max="10"
            :line-height="slider.lineHeight"
            :process-style="slider.processStyle"
            :tooltip-styles="slider.tooltipStyles"
          />
        </div>
        <div class="column">
          Words: {{ 10 * assignments[worker.id] }}%
        </div>
      </div>
      <hr>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductionGrid',
  props: {
    buyAmount: {
      type: Number,
      required: true,
    },
    workers: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    assignments: {
      child: 0,
      student: 0,
    },
    previousAssignments: {
      child: 0,
      student: 0,
    },
    slider: {
      lineHeight: 8,
      processStyle: {
        backgroundColor: '#7957d5',
      },
      tooltipStyles: {
        backgroundColor: '#7957d5',
        borderColor: '#7957d5',
        color: '#7957d5',
      },
    },
  }),
  watch: {
    assignments: {
      handler(val) {
        Object.keys(this.assignments).forEach((workerId) => {
          if (this.assignments[workerId] !== this.previousAssignments[workerId]) {
            const balance = val[workerId];

            // send new balance value to Game
            this.$emit('updateWorkerBalance', { workerId, balance });

            this.previousAssignments[workerId] = val[workerId];
          }
        });
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.production {
  margin: 0 auto;
  width: 800px;
}
</style>
