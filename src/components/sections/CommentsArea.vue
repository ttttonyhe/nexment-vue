<template>
  <div class="nexment-comment-area" id="nexment-comment-area">
    <div class="nexment-comment-area-top">
      <input placeholder="昵称" v-model="commentName" />
      <input placeholder="邮箱" v-model="commentEmail" />
      <input
        placeholder="站点链接"
        v-model="commentLink"
        v-if="config.enableLinkInput"
      />
    </div>
    <div class="nexment-comment-area-middle">
      <autosize-textarea
        v-model="commentContent"
        :ID="commentAreaID"
        ref="textarea"
        :class="previewStatus ? 'nexment-previewing' : ''"
      />
      <div class="nexment-md-preview markdown-body" v-if="previewStatus">
        <VueShowdown
          :markdown="commentContent ? commentContent : '无内容可预览'"
        />
      </div>
    </div>
    <div class="nexment-comment-area-bottom">
      <div>
        <button
          :class="getReplyDisplay()"
          v-tooltip="'重置回复'"
          @click="setResetStatus"
        >
          <Icons
            name="resetFill"
            v-if="getReplyDisplay() === 'nexment-replying'"
          />
          <Icons name="resetReply" v-else />
          <em>{{ getReplyTo() }}</em>
          <b><Icons name="cancel"/></b>
        </button>

        <v-popover
          :open="emojiPopoverVisibility"
          @auto-hide="toggleEmojiCard()"
          trigger="manual"
          class="nexment-comment-area-popover"
          placement="right"
          popoverClass="nexment-popover-emoji"
          popoverInnerClass="nexment-comment-area-popover-inner tooltip-inner popover-emoji-inner"
        >
          <button
            v-tooltip="{ content: 'Emoji', classes: 'nexment-popover-tooltip' }"
            @click="toggleEmojiCard"
          >
            <Icons name="emoji" />
          </button>
          <template slot="popover">
            <emoji-card
              @closeFunc="toggleEmojiCard"
              @insertFunc="insertEmoji"
            />
          </template>
        </v-popover>

        <v-popover
          :open="tagPopoverVisibility"
          @auto-hide="toggleTagCard()"
          trigger="manual"
          class="nexment-comment-area-popover"
          placement="top"
          popoverClass="nexment-popover-tag"
          popoverInnerClass="nexment-comment-area-popover-inner tooltip-inner"
        >
          <button
            style="padding: 0px;"
            v-tooltip="{
              content: '描述标签',
              classes: 'nexment-popover-tooltip',
            }"
            @click="toggleTagCard"
          >
            <Icons name="tag" />
          </button>
          <template slot="popover">
            <tag-card
              :tag="commentTag"
              @closeFunc="toggleTagCard"
              @changeFunc="changeTag"
            />
          </template>
        </v-popover>

        <button
          @click="setCommentEwr"
          v-tooltip="commentEwr ? '取消订阅' : '订阅回复'"
        >
          <Icons name="email" v-if="commentEwr" />
          <Icons name="emailFill" v-else />
        </button>

        <button v-tooltip="'头像'">
          <a
            href="https://cn.gravatar.com/support/what-is-gravatar"
            target="_blank"
          >
            <Icons name="avatar" />
          </a>
        </button>

        <button
          @click="togglePreview"
          v-tooltip="previewStatus ? '关闭预览' : '预览'"
        >
          <Icons name="markdownFill" v-if="previewStatus" />
          <Icons name="markdown" v-else />
        </button>

        <button
          v-if="AV.User.current()"
          @click="toggleLogout"
          v-tooltip="'退出登录'"
        >
          <Icons name="logout" />
        </button>
      </div>
      <div>
        <button @click="sendComment()">
          发送评论
        </button>
      </div>
    </div>
    <verification
      v-if="verificationCardStatus"
      :config="config"
      @closeFunc="toggleVerification"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { defineComponent } from "@vue/composition-api";
import autosize from "autosize";
import Icons from "../icons/index.vue";
import "../../assets/style/commentarea.scss";
import "github-markdown-css";
import AutosizeTextarea from "../controls/textarea.vue";
import EmojiCard from "../controls/emojiCard/index.vue";
import TagCard from "../controls/tagCard/index.vue";
import leanCloud from "../../lib/database/initiation";

import insertTextAtCursor from "insert-text-at-cursor";

import usingSaveComment from "../../lib/database/saveComment";
import generateCommentID from "../../lib/utils/generateCommentID";

import Verification from "../modal/verification.vue";

// Local storage
import Storage from "vue-ls";
const options = {
  namespace: "nexment__", // key prefix
  name: "ls", // name variable Vue.[ls] or this.[$ls],
  storage: "local", // storage name session, local, memory
};
Vue.use(Storage, options);

export default defineComponent({
  name: "CommentsArea",
  props: [
    "config",
    "pageKey",
    "replyTo",
    "replyToOID",
    "replyToName",
    "primaryReplyTo",
    "primaryReplyToOID",
    "primaryReplyToName",
    "reloadFunc",
  ],
  components: {
    AutosizeTextarea,
    Icons,
    EmojiCard,
    TagCard,
    Verification,
  },
  data() {
    return {
      modalStatus: false,
      previewStatus: false,
      commentContent: "",
      resetStatus: false,
      commentEwr: false,
      emojiPopoverVisibility: false,
      tagPopoverVisibility: false,
      commentTag: "",
      commentName: "",
      commentLink: "",
      commentEmail: "",
      commentAreaID: Math.random(),
      AV: leanCloud(
        this.config.leancloud.appId,
        this.config.leancloud.appKey,
        this.config.leancloud.serverURL
      ),
      verificationCardStatus: false,
    } as {
      modalStatus: boolean;
      previewStatus: boolean;
      commentContent: string;
      resetStatus: boolean;
      commentEwr: boolean;
      emojiPopoverVisibility: boolean;
      tagPopoverVisibility: boolean;
      commentTag: string;
      commentName: string;
      commentLink: string;
      commentEmail: string;
      commentAreaID: number;
      AV: any;
      verificationCardStatus: boolean;
    };
  },
  mounted() {
    const lsData = this.$ls.get("nexment-commenterInfo");
    if (lsData) {
      ["tag", "name", "email", "link"].map((item) => {
        if (lsData[item]) {
          this[
            "comment" + item.substring(0, 1).toUpperCase() + item.substring(1)
          ] = lsData[item];
        }
      });
    }
  },
  methods: {
    togglePreview() {
      this.previewStatus = !this.previewStatus;
    },
    setCommentEwr() {
      this.commentEwr = !this.commentEwr;
    },
    getReplyDisplay() {
      if (this.resetStatus) {
        if (this.$props.primaryReplyToName) {
          return "nexment-replying";
        } else {
          return "";
        }
      } else {
        if (this.$props.primaryReplyToName || this.$props.replyToName) {
          return "nexment-replying";
        } else {
          return "";
        }
      }
    },
    getReplyTo() {
      if (this.resetStatus) {
        return this.$props.primaryReplyToName;
      } else {
        return this.$props.replyToName;
      }
    },
    toggleLoading() {
      this.$emit("reloadFunc");
    },
    toggleEmojiCard() {
      this.emojiPopoverVisibility = !this.emojiPopoverVisibility;
    },
    toggleTagCard() {
      this.tagPopoverVisibility = !this.tagPopoverVisibility;
    },
    insertEmoji(content: string) {
      const el = document.getElementById(
        "nexmentTextArea" + this.commentAreaID
      );
      if (el) {
        let insert: any = insertTextAtCursor;
        insert(el, content);
      }
    },
    changeTag(content: string) {
      this.commentTag = content;
    },
    setResetStatus() {
      this.resetStatus = true;
      this.$emit("resetFunc");
    },
    // Comment submitting function
    async sendComment() {
      // Start loading
      this.toggleLoading();
      let replyingTo = this.resetStatus
        ? this.$props.primaryReplyTo
        : this.$props.replyTo;
      let replyingToOID = this.resetStatus
        ? this.$props.primaryReplyToOID
        : this.$props.replyToOID;
      let thisID = generateCommentID().idData;
      const returnData = await usingSaveComment(
        {
          ID: thisID,
          identifier: this.$props.config.pageKey,
          name: this.commentName,
          email: this.commentEmail,
          link: this.commentLink ? this.commentLink : undefined,
          content: this.commentContent,
          tag: this.commentTag,
          reply: replyingTo ? replyingTo : undefined,
          replyOID: replyingToOID ? replyingToOID : undefined,
          ewr: this.commentEwr,
        },
        this.$props.config
      );
      // Finish loading
      this.toggleLoading();
      if (returnData.status === 500) {
        alert("评论发送失败");
      } else if (returnData.status === 501) {
        this.toggleVerification();
      } else {
        // Comment success
        // Store commenter info
        this.setCommenterInfo({
          name: this.commentName,
          email: this.commentEmail,
          tag: this.commentTag,
          link: this.commentLink,
        });
        // Set content to empty
        const ref: any = this.$refs.textarea;
        ref.clearText();
        // Refetch data using swr mutate
        this.$emit("refetchFunc");
        // Jump to replied to/comment item
        if (replyingTo) {
          window.location.href = "#" + replyingTo;
        } else {
          window.location.href = "#" + thisID;
        }
      }
    },
    setCommenterInfo(info: {
      name: string;
      email: string;
      tag: string;
      link?: string;
    }) {
      this.$ls.set("nexment-commenterInfo", info);
    },
    toggleLogout() {
      this.AV.User.logOut();
      window.location.reload();
    },
    toggleVerification() {
      this.verificationCardStatus = !this.verificationCardStatus;
    },
  },
  watch: {
    commentEmail: function(email) {
      if (email === this.config.admin.email && !this.AV.User.current()) {
        this.toggleVerification();
      }
    },
    commentName: function(name) {
      if (name === this.config.admin.name && !this.AV.User.current()) {
        this.toggleVerification();
      }
    },
    replyToName: function(name) {
      if (name) {
        this.resetStatus = false;
      }
    },
  },
});
</script>
