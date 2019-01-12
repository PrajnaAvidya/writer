<template>
  <div class="game">
    <div class="words">Words: {{ words }}</div>

    <b-tooltip
      label="Write some words"
      position="is-bottom"
      class="write"
    >
      <a class="button is-primary" @click="write">
        <b-icon icon="pen" />
      </a>
    </b-tooltip>

    <hr />

    <div class="production">
      <div class="columns">
        <div class="column">
          asdf
        </div>
        <div class="column">
          asdf
        </div>
        <div class="column">
          asdf
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'game',
  computed: {
    ...mapGetters([
      'words',
    ]),
  },
  mounted() {
    console.log(this.$router);
    console.log(this.$store);
  },
  methods: {
    write() {
      this.$store.commit('incrementWords', 1);
    },
  },
};
</script>

<style lang="scss">
.words {
  margin-bottom: 15px;
}

.write {
  margin-bottom: 20px;
}

.production {
  margin: 0 auto;
  width: 800px;
}
</style>
