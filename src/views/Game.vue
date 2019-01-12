<template>
  <div class="game">
    <div class="words">
    Words: {{ words }}
    </div>
    <button @click="write">Write</button>
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
