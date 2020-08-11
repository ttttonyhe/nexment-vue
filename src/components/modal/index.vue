<template>
  <div>
    <modal name="repliesList">
      This is an alert.
      <button @click="closeModal()">Close</button>
    </modal>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { defineComponent } from "@vue/composition-api";
import VModal from "vue-js-modal";
Vue.use(VModal);

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
  },
  mounted(){
    this.$modal.show('repliesList');
  },
  methods: {
    closeModal() {
      this.$modal.hide('repliesList');
      this.$emit("close", this.$props.replyToOID);
    },
  },
});
</script>
