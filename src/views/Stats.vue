<template>
  <div>
    <table class="table">
      <tbody>
        <tr
          v-for="stat in Object.keys(milestoneTargets)"
          :key="stat"
        >
          <th>{{ statDescriptions[stat] }}</th>
          <td
            v-if="stat === 'money' || stat === 'moneySpent'"
            style="width: 150px;"
          >
            {{ stats[stat] | moneyCents }} ({{ milestoneCount[stat] }})
          </td>
          <td
            v-else
            style="width: 150px;"
          >
            {{ stats[stat] | round }} ({{ milestoneCount[stat] }})
          </td>
          <td style="width: 300px">
            <div
              class="stat-progress tooltip is-tooltip-bottom"
              :data-tooltip="tooltip(stat)"
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
import { mapState } from 'vuex';

export default {
  name: 'Stats',
  computed: {
    ...mapState('statistics', [
      'stats',
      'milestoneTargets',
      'milestoneCount',
      'statDescriptions',
    ]),
    ...mapState('currency', [

    ]),
  },
  methods: {
    tooltip(stat) {
      if (stat === 'money' || stat === 'moneySpent') {
        return `${this.$options.filters.moneyCents(this.stats[stat])} / ${this.$options.filters.moneyCents(this.milestoneTargets[stat])}`;
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
