<template>
  <textarea
    :value="value"
    placeholder="键入一些内容吧..."
    @input="handleChange"
    id="nexmentTextArea"
  ></textarea>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import autosize from "autosize";

export default defineComponent({
  name: "AutosizeTextarea",
  props: ["value"],
  mounted() {
    autosize(this.$el);
  },
  methods: {
    handleChange(e: any) {
      this.$emit("input", e.target.value);
    },
    clearText() {
      this.$emit("input", "");
    },
  },
});
</script>
