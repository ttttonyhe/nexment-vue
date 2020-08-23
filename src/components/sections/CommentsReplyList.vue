<template>
  <ul class="nexment-comments-reply-list nexment-inner-reply-list">
    <div
      v-for="replyItem in item.replyList"
      class="nexment-comments-list-item-div nexment-comments-list-item-div-inner"
      :key="replyItem.ID"
      :id="replyItem.ID.toString()"
    >
      <li class="nexment-comments-list-item">
        <div
          :class="
            'nexment-comments-div ' +
              (replyItem.hasReplies ? 'nexment-comments-div-with-replies' : '')
          "
          @click="handleReplyClickReply(replyItem)"
        >
          <div class="nexment-comments-avatar">
            <img :src="avatarSrc(replyItem)" />
            <div
              v-if="adminBadge(replyItem.name, replyItem.email)"
              class="nexment-admin-badge"
            >
              <Icons name="admin" />
            </div>
          </div>
          <div class="nexment-comments-title">
            <h5>
              <a
                :href="replyItem.link"
                target="_blank"
                v-html="replyItem.name"
              ></a>
              <span> · </span>
              <b>{{ commentDate(replyItem) }}</b>
              <em class="nexment-reply-icon-reply">
                <Icons name="reply" />
              </em>
            </h5>
            <div class="nexment-comments-content margin-top-reply">
              <VueShowdown :markdown="replyItem.content" />
            </div>
          </div>
        </div>
      </li>
      <div v-if="replyItem.hasReplies && !config.enableReplyListModal">
        <CommentsReplyList
          :config="config"
          :item="replyItem"
          :handleReplyClickReply="handleReplyClickReply"
          :avatarSrc="avatarSrc"
          :adminBadge="adminBadge"
          :commentDate="commentDate"
          :getLang="getLang"
        />
      </div>
    </div>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

// Icons
import Icons from "@/components/icons/index.vue";

export default defineComponent({
  name: "CommentsReplyList",
  props: [
    "config",
    "item",
    "getLang",
    "commentDate",
    "adminBadge",
    "avatarSrc",
    "handleReplyClickReply",
  ],
  components: {
    Icons,
  },
});
</script>
