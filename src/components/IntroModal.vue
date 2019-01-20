<template>
  <BModal
    :active="active"
    :can-cancel="false"
  >
    <div class="card">
      <h1 class="title is-1">
        Writer Incremental
      </h1>

      <div class="field is-grouped is-grouped-multiline">
        <p class="control">
          You are a struggling writer named
        </p>
        <p class="control">
          <BInput v-model="name" />
        </p>
      </div>
      <div class="field is-grouped is-grouped-multiline">
        <p class="control">
          Some sort of intro will be here telling you what to do first.
        </p>
      </div>

      <a
        class="button is-primary"
        @click="ok"
      >
        OK
      </a>
    </div>
  </BModal>
</template>

<script>
export default {
  name: 'IntroModal',
  data: () => ({
    active: false,
    name: 'Rafiq',
  }),
  methods: {
    ok() {
      this.active = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  padding: 50px;
}
</style>
