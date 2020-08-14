<template>
  <textarea
    :value="value"
    :placeholder="getLang('placeHolder')"
    @input="handleChange"
    :id="'nexmentTextArea' + ID"
  ></textarea>
</template>

<script lang="ts">
/** 
  Auto-resize textarea
*/
import { defineComponent } from "@vue/composition-api";
import autosize from "autosize";

// i18n
import getLang from "../../configs/languages";

export default defineComponent({
  name: "AutosizeTextarea",
  props: ["value", "ID"],
  setup() {
    return {
      getLang,
    };
  },
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
