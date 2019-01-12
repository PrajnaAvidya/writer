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
export default {
  name: 'game',
  data: () => ({
    words: 0,
  }),
  mounted() {
    console.log(this.$router);
    console.log(this.$store);
  },
  methods: {
    write() {
      this.words += 1;
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
