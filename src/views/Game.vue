<template>
  <div class="game">
    <div class="words">Words: {{ words }}</div>

    <a class="button is-primary" @click="write"><span class="fas fa-pen"></span></a>
  </div>
</template>

<script>
export default {
  name: 'game',
  data: () => ({
    words: 0,
  }),
  methods: {
    write() {
      this.words += 1;
    },
  },
};
</script>
