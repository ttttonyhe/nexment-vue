<template>
  <div class="nexment-popover">
    <div class="nexment-popover-text">
      <b>{{ getLang("desTag") }}</b>
    </div>
    <p>{{ getLang("desTagDes") }}</p>
    <div class="nexment-popover-input">
      <input
        :placeholder="tag ? tag : '描述标签'"
        v-model="tagNow"
        @change="changeTag"
      />
      <button class="nexment-tag-button" @click="closeCard()">
        {{ getLang("confirm") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
/** 
  Description tag card
*/
import { defineComponent } from "@vue/composition-api";

// i18n
import getLang from "../../../configs/languages";

export default defineComponent({
  name: "TagCard",
  props: ["tag"],
  setup() {
    return {
      getLang,
    };
  },
  data() {
    return {
      tagNow: "",
    } as {
      tagNow: string;
    };
  },
  methods: {
    closeCard() {
      this.$emit("closeFunc");
    },
    changeTag() {
      this.$emit("changeFunc", this.tagNow);
    },
  },
});
</script>
