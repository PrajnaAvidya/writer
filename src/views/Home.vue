<template>
  <div class="home">
    <CreativeButtons
      :player-words="playerWords"
    />
  </div>
</template>

<script>
import CreativeButtons from '@/components/CreativeButtons.vue';

export default {
  name: 'Home',
  components: {
    CreativeButtons,
  },
  props: {
    playerWords: {
      type: Object,
      required: true,
    },
  },
};
</script>
