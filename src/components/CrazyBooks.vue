<template>
  <div>
    <div
      v-for="book in Array(numberOfBooks)"
      :key="book"
      class="book"
      :style="{ top: `${randomY()}px`, right: `${randomX()}px` }"
    >
      <img src="/images/book.png">
    </div>
  </div>
</template>

<script>
export default {
  name: 'CrazyBooks',
  data: () => ({
    numberOfBooks: 0,
  }),
  mounted() {
    setInterval(() => {
      if (this.numberOfBooks < 500) {
        this.numberOfBooks += 1;
      }
    }, 50);
  },
  methods: {
    randomX() {
      return Math.floor(Math.random() * document.body.offsetWidth);
    },
    randomY() {
      return Math.floor(Math.random() * document.body.offsetHeight);
    },
  },
};
</script>

<style lang="scss">
.book {
  position: absolute;
  opacity: 0.75;
  z-index: 99999999;
}
</style>
