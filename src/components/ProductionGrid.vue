<template>
  <div :hidden="!showProduction">
    <BuyAmounts />

    <div
      v-for="worker in workers"
      :key="worker.id"
      class="production"
    >
      <div
        slot="title"
        class="columns"
      >
        <div class="column">
          <a
            class="button"
            @click="$root.$emit('hireWorker', worker.id)"
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
      <hr>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BuyAmounts from './BuyAmounts.vue';

export default {
  name: 'ProductionGrid',
  components: {
    BuyAmounts,
  },
  props: {
    showProduction: Boolean,
    workers: {
      type: Object,
      required: true,
    },
    assignments: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    previousAssignments: {},
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
  computed: {
    ...mapState([
      'buyAmount',
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
    this.previousAssignments = this.assignments;
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
