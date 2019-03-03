<template>
  <div>
    <div
      v-for="worker in workers"
      :key="worker.id"
      class="production"
      :class="{ 'is-hidden': !showRecruiter(worker) }"
    >
      <div class="columns">
        <div class="buy-column">
          <a
            class="button buy-button tooltip"
            :disabled="recruiterCosts[worker.id].gt(money)"
            :data-tooltip="tooltip(worker)"
            @click="$root.$emit('hireRecruiter', worker.id)"
          >
            <i
              class="fas fa-2x worker-icon"
              :class="worker.icon"
            />
            <i
              class="fas fa-2x fa-file-signature worker-icon"
            />
            <span>
              <strong>Hire {{ worker.name }} Recruiter</strong>
            </span>
          </a>
        </div>
        <div class="cost-column">
          Cost {{ recruiterCosts[worker.id] | money }}
          <div
            v-if="true"
          >
            {{ recruiters[worker.id] }} Recruiter{{ recruiters[worker.id] !== 1 ? 's' : '' }} Hired
          </div>
        </div>
      </div>
      <hr>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Big from 'big.js';

export default {
  name: 'Recruiting',
  computed: {
    ...mapState('currency', [
      'money',
    ]),
    ...mapState('workers', [
      'workers',
    ]),
    ...mapState('recruiting', [
      'recruiters',
      'recruiterCosts',
    ]),
  },
  methods: {
    tooltip(worker) {
      return `Hires a ${worker.name} every 10 seconds`;
    },
    showRecruiter(worker) {
      return true;
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
  width: 500px;
}
.cost-column {
  width: 300px;
}
</style>
