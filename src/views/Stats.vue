<template>
  <div>
    <table class="table">
      <tbody>
        <tr
          v-for="stat in Object.keys(milestones)"
          :key="stat"
        >
          <th>{{ statDescriptions[stat] }}</th>
          <td
            v-if="stat === 'money' || stat === 'moneySpent'"
            style="width: 150px;"
          >
            {{ statistics[stat] | moneyCents }} ({{ milestoneCount[stat] }})
          </td>
          <td
            v-else
            style="width: 150px;"
          >
            {{ statistics[stat] | round }} ({{ milestoneCount[stat] }})
          </td>
          <td style="width: 300px">
            <div
              class="stat-progress tooltip is-tooltip-bottom"
              :data-tooltip="tooltip(stat)"
            >
              <progress
                class="progress is-info"
                :value="statistics[stat]"
                :max="milestones[stat]"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Stats',
  computed: {
    ...mapState('game', [
      'currency',
      'statistics',
      'milestones',
      'milestoneCount',
      'statDescriptions',
    ]),
  },
  methods: {
    tooltip(stat) {
      if (stat === 'money' || stat === 'moneySpent') {
        return `${this.$options.filters.moneyCents(this.statistics[stat])} / ${this.$options.filters.moneyCents(this.milestones[stat])}`;
      }
      return `${this.$options.filters.round(this.statistics[stat])} / ${this.$options.filters.round(this.milestones[stat])}`;
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
