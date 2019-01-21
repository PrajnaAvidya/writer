<template>
  <div class="home">
    <img
      src="@/assets/writing.jpg"
      width="40%"
      height="40%"
    >
    <CreativeButtons />
  </div>
</template>

<script>
import CreativeButtons from '../components/CreativeButtons.vue';

export default {
  name: 'Home',
  components: {
    CreativeButtons,
  },
};
</script>
