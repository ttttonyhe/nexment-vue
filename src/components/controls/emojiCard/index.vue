<template>
  <div class="nexment-emoji-container">
    <div
      class="nexment-emoji-section"
      v-for="cate in emojis"
      :key="'cate' + cate"
    >
      <div class="nexment-emoji-section-header">
        <b>{{ cate[0] }}</b>
      </div>
      <div class="nexment-emoji-section-box">
        <div class="nexment-emoji-section-container">
          <span
            v-for="item in cate.slice(1)"
            :key="'emoji' + item"
            @click="insertEmoji(item)"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/** 
  Emoji selection card
*/
import { defineComponent } from "@vue/composition-api";
import emojis from "./emoji";

export default defineComponent({
  name: "EmojiCard",
  data() {
    return {
      emojis: emojis,
    };
  },
  methods: {
    closeCard() {
      this.$emit("closeFunc");
    },
    insertEmoji(content: string) {
      this.$emit("insertFunc", content);
      this.closeCard();
    },
  },
});
</script>
