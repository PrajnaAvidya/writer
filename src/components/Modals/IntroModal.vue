<template>
  <BaseModal
    ref="modal"
    title="Writer Incremental"
    :initial-state="!(debug.enabled && debug.disableTutorials)"
  >
    <div class="field is-grouped text input-text">
      I am a struggling writer named &nbsp;
      <p class="control">
        <input
          v-model="playerName"
          class="input test1234"
          type="text"
        >
      </p>
      &nbsp; down to my very last dollar
    </div>
    <div class="text">
      All that I can do now is write as many WORDS as possible.
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
import { mapState, mapMutations } from 'vuex';
import BaseModal from '@/components/Modals/BaseModal.vue';

export default {
  name: 'IntroModal',
  components: {
    BaseModal,
  },
  data: () => ({
    playerName: 'Rafiq',
  }),
  computed: {
    ...mapState([
      'debug',
    ]),
  },
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

<style lang="scss" scoped>
.text {
  text-align: center;
  height: 35px;
  line-height: 35px;
}
.input-text {
  margin-left: 10px;
}
input {
  width: 150px;
}
</style>
