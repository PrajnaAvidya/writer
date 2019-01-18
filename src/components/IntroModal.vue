<template>
  <BModal :active.sync="modalActive">
    <div class="card">
      Intro/Tutorial Goes Here
    </div>
  </BModal>
</template>

<script>
export default {
  name: 'IntroModal',
  data: () => ({
    modalActive: true,
  }),
};
</script>

<style lang="scss" scoped>

</style>
