<template>
  <div>
    <span class="is-size-4">
      Total Milestones: {{ milestones | round }}
    </span>
    <table class="table">
      <tbody>
        <tr
          v-for="stat in visibleStats"
          :key="stat"
        >
          <th
            :class="{tooltip: stat === 'workers' && checkUnfolding('showManagers')}"
            data-tooltip="Does not include workers hired by managers"
          >
            {{ statDescriptions[stat] }}
          </th>
          <td
            v-if="stat === 'money'"
            style="width: 150px;"
            class="tooltip"
            :data-tooltip="numberTooltip(stat)"
          >
            {{ stats[stat] | money }}
          </td>
          <td
            v-else
            style="width: 150px;"
            class="tooltip"
            :data-tooltip="numberTooltip(stat)"
          >
            {{ stats[stat] | round }}
          </td>
          <td style="width: 300px">
            <div
              class="stat-progress tooltip is-tooltip-bottom"
              :data-tooltip="progressTooltip(stat)"
            >
              <progress
                class="progress is-info"
                :value="stats[stat]"
                :max="milestoneTargets[stat]"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Stats',
  computed: {
    visibleStats() {
      if (this.checkUnfolding('showManagers')) {
        return Object.keys(this.milestoneTargets);
      }

      return Object.keys(this.milestoneTargets).filter(stat => stat !== 'managers');
    },
    ...mapState('statistics', [
      'stats',
      'milestoneTargets',
      'milestoneCount',
      'statDescriptions',
    ]),
    ...mapState('currency', [
      'milestones',
    ]),
    ...mapGetters('unfolding', [
      'checkUnfolding',
    ]),
  },
  methods: {
    numberTooltip(stat) {
      return `${this.statDescriptions[stat]} Milestones: ${this.milestoneCount[stat]}`;
    },
    progressTooltip(stat) {
      if (stat === 'money') {
        return `${this.$options.filters.money(this.stats[stat])} / ${this.$options.filters.money(this.milestoneTargets[stat])}`;
      }
      return `${this.$options.filters.round(this.stats[stat])} / ${this.$options.filters.round(this.milestoneTargets[stat])}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  margin: 0 auto;
  margin-top: 10px;
}
.stat-progress {
  top: 5px;
}
</style>
