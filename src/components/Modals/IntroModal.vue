<template>
  <BaseModal
    ref="modal"
    title="Writer Incremental"
    :initial-state="true"
  >
    <div class="field is-grouped">
      You are a struggling writer named &nbsp;
      <p class="control">
        <input
          v-model="playerName"
          class="input test1234"
          type="text"
        >
      </p>
      &nbsp; down to your very
    </div>
    <div>
      last dollar. Some instructions will go here telling you what to do first.
    </div>
    <template slot="footer">
      <button
        class="button"
        @click="closeIntro()"
      >
        OK
      </button>
    </template>
  </BaseModal>
</template>

<script>
import { mapMutations } from 'vuex';
import BaseModal from '@/components/Modals/BaseModal.vue';

export default {
  name: 'IntroModal',
  components: {
    BaseModal,
  },
  data: () => ({
    playerName: 'Rafiq',
  }),
  methods: {
    closeIntro() {
      this.updateData({ index: 'playerName', value: this.playerName });
      this.$refs.modal.close();
    },
    ...mapMutations([
      'updateData',
    ]),
  },
};
</script>

<style scoped>

</style>
