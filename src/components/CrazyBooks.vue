<template>
  <div>
    <div
      v-for="book in Array(numberOfBooks)"
      :key="book"
      class="book"
      :style="{ top: `${randomY()}px`, right: `${randomX()}px` }"
    >
      <img src="@/assets/book.png">
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import log from '@/utils/log';
import notify from '@/utils/notify';
import animatePlus from '@/utils/animatePlus';
import randomInt from '@/utils/randomInt';

export default {
  name: 'ClickableBook',
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
.bonus-plus {
  font-weight: bold;
  font-size: 250%;
  position : absolute;
  color: #DE636F;
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
}
</style>
