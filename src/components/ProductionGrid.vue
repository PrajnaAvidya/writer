<template>
  <div>
    <div
      v-for="worker in workers"
      :key="worker.id"
      class="production"
    >
      <div
        slot="title"
        class="columns accordion-title"
      >
        <div class="column">
          <a
            class="button"
            @click="hireWorker(worker.id)"
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

      <div slot="content">
        <div class="columns worker-balance">
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
      </div>
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
    displayWorker: {
      child: true,
      student: false,
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
  methods: {
    hireWorker(workerId) {
      // TODO keep accordion open
      this.$emit('hireWorker', workerId);
    },
  },
};
</script>

<style lang="scss">
.production {
  margin: 0 auto;
  width: 800px;
}
.accordion-title {
  width: 100%;
  font-weight: bold;
}
.not-hired {
  margin-top: -5px;
  margin-bottom: -5px;
}
</style>
