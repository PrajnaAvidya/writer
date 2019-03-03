<template>
  <section class="section nav">
    <div id="nav">
      <hr>
      <RouterLink
        v-if="checkUnfolding('showJobs')"
        to="/jobs"
        class="nav-link"
      >
        <i class="fas fa-briefcase fa-lg" />
        Jobs
      </RouterLink>
      <RouterLink
        v-if="checkUnfolding('showWorkers')"
        to="/workers"
        class="nav-link"
      >
        <i class="fas fa-building fa-lg" />
        Workers
      </RouterLink>
      <RouterLink
        v-if="checkUnfolding('showUpgrades')"
        to="/upgrades"
        class="nav-link"
      >
        <i class="fas fa-arrow-up fa-lg" />
        Upgrades
      </RouterLink>
      <RouterLink
        v-if="checkUnfolding('showUpgrades')"
        to="/recruiting"
        class="nav-link"
      >
        <i class="fas fa-comments-dollar fa-lg" />
        Recruiting
      </RouterLink>

      <RouterLink
        v-if="checkUnfolding('showStats')"
        to="/stats"
        class="nav-link nav-stats"
      >
        <i class="fas fa-chart-line fa-lg" />
        Stats
      </RouterLink>
      <RouterLink
        v-if="checkUnfolding('showRebirth')"
        to="/rebirth"
        class="nav-link"
      >
        <i class="fas fa-recycle fa-lg" />
        Rebirth
      </RouterLink>
      <RouterLink
        v-if="checkUnfolding('showBonus')"
        to="/bonus"
        class="nav-link"
      >
        <i class="fas fa-star fa-lg" />
        Bonus
      </RouterLink>

      <RouterLink
        to="/options"
        class="nav-link nav-options"
      >
        <i class="far fa-check-square fa-lg" />
        Options
      </RouterLink>
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
.nav-stats, .nav-options {
  margin-left: 40px;
}
</style>
