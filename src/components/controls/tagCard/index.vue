<template>
  <div class="nexment-popover">
    <div class="nexment-popover-text">
      <b>描述标签</b>
    </div>
    <p>使用描述标签让观众了解你的专业、知识和身份背景</p>
    <div class="nexment-popover-input">
      <input
        :placeholder="tag ? tag : '描述标签'"
        v-model="tagNow"
        @change="changeTag"
      />
      <button class="nexment-tag-button" @click="closeCard()">
        确认
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  name: "TagCard",
  props: ["tag"],
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
