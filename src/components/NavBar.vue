<template>
  <section class="section nav">
    <div id="nav">
      <hr>
      <Transition
        v-if="showJobs"
        name="fade"
      >
        <RouterLink
          to="/jobs"
          class="nav-link"
        >
          <i class="fas fa-briefcase fa-lg" />
          Jobs
        </RouterLink>
      </Transition>
      <Transition
        v-if="showWorkers"
        name="fade"
      >
        <RouterLink
          to="/workers"
          class="nav-link"
        >
          <i class="fas fa-building fa-lg" />
          Workers
        </RouterLink>
      </Transition>
      <Transition
        v-if="showUpgrades"
        name="fade"
      >
        <RouterLink
          to="/upgrades"
          class="nav-link"
        >
          <i class="fas fa-arrow-up fa-lg" />
          Upgrades
        </RouterLink>
      </Transition>
      <Transition
        v-if="showStats"
        name="fade"
      >
        <RouterLink
          to="/stats"
          class="nav-link"
        >
          <i class="fas fa-chart-line fa-lg" />
          Stats
        </RouterLink>
      </Transition>
      <hr>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'NavBar',
  computed: {
    ...mapState([
      'showJobs',
      'showWorkers',
      'showUpgrades',
      'showStats',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.nav {
  font-size: 16pt;
}
.nav-link {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
