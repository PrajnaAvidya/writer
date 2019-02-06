<template>
  <div>
    <table class="table">
      <tbody>
        <tr
          v-for="stat in Object.keys(milestones)"
          :key="stat"
        >
          <th>{{ statDescriptions[stat] }}</th>
          <td v-if="stat === 'money' || stat === 'moneySpent'">
            {{ statistics[stat] | moneyCents }}
          </td>
          <td v-else>
            {{ statistics[stat] | round }}
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
    upgradePercent() {
      return this.statistics.upgrades.div(this.statistics.totalUpgrades).times(100).toFixed(0);
    },
    ...mapState([
      'playerName',
      'statistics',
      'milestones',
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
}
.stat-progress {
  top: 5px;
}
</style>
