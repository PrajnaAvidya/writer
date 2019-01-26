<template>
  <div class="home">
    <CreativeButtons
      :player-ideas="playerIdeas"
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
    playerIdeas: {
      type: Object,
      required: true,
    },
    playerWords: {
      type: Object,
      required: true,
    },
  },
};
</script>
