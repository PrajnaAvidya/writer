<template>
  <section class="section nav">
    <div id="nav">
      <hr>
      <Transition
        v-if="checkUnfolding('showJobs')"
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
        v-if="checkUnfolding('showWorkers')"
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
        v-if="checkUnfolding('showUpgrades')"
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
        v-if="checkUnfolding('showStats')"
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
      <Transition
        v-if="checkUnfolding('showRebirth')"
        name="fade"
      >
        <RouterLink
          to="/rebirth"
          class="nav-link"
        >
          <i class="fas fa-recycle fa-lg" />
          Rebirth
        </RouterLink>
      </Transition>
      <Transition
        v-if="checkUnfolding('showBonus')"
        name="fade"
      >
        <RouterLink
          to="/bonus"
          class="nav-link"
        >
          <i class="fas fa-star fa-lg" />
          Bonus
        </RouterLink>
      </Transition>
      <hr>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'NavBar',
  computed: {
    ...mapGetters('unfolding', [
      'checkUnfolding',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.nav {
  font-size: 14pt;
}
.nav-link {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
