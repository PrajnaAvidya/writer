<template>
  <div
    v-if="bookActive"
    class="book"
    :style="{ top: `${bookPosition.y}px`, right: `${bookPosition.x}px` }"
    @click="clickBook($event)"
  >
    <img src="@/assets/book.png">
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ClickableBook',
  computed: {
    ...mapState([
      'bookActive',
      'bookPosition',
    ]),
  },
  methods: {
    clickBook($event) {
      console.log($event);
    },
  },
};
</script>

<style lang="scss" scoped>
.book {
  position: absolute;
  opacity: 0.75;
}
</style>
