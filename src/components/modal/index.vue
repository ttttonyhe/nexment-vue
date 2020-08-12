<template>
  <div class="nexment-modal-replies">
    <modal
      name="repliesList"
      :adaptive="true"
      height="90vh"
      @closed="modalCloseHandler"
    >
      <div class="nexment-modal-header">
        <a @click="closeModal()">
          <Icons name="modalCancel" />
        </a>
      </div>
      <div>
        <RepliesList
          :dataContent="content"
          :replyTo="replyTo"
          :pageKey="pageKey"
          :replyToOID="replyToOID"
          :replyToName="replyToName"
          :replyItem="replyItem"
          :config="config"
        />
      </div>
    </modal>
  </div>
</template>
<script lang="ts">
import "../../assets/style/modal.scss";
import Vue from "vue";
import { defineComponent } from "@vue/composition-api";
import VModal from "vue-js-modal";
Vue.use(VModal);
import RepliesList from "../sections/RepliesList.vue";
import Icons from "../icons/index.vue";

export default defineComponent({
  name: "ReplyModal",
  props: {
    type: String,
    content: Object,
    replyTo: String,
    pageKey: String,
    replyToID: Number,
    replyToOID: String,
    replyToName: String,
    replyItem: Object,
    config: Object,
  },
  components: {
    RepliesList,
    Icons,
  },
  mounted() {
    this.$modal.show("repliesList");
  },
  methods: {
    closeModal() {
      this.$modal.hide("repliesList");
    },
    modalCloseHandler() {
      this.$emit("close", this.$props.replyToOID);
    },
  },
});
</script>
