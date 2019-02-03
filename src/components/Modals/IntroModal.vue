<template>
  <BaseModal
    ref="modal"
    title="Writer Incremental"
    :initial-state="true"
  >
    <div class="field is-grouped text input-text">
      You are a struggling writer named &nbsp;
      <p class="control">
        <input
          v-model="playerName"
          class="input test1234"
          type="text"
        >
      </p>
      &nbsp; down to your very last
    </div>
    <div class="text">
      dollar. All that you can do now is write as many WORDS as possible.
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
