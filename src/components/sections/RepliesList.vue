<template>
  <div>
    <div class="nexment-modal-text">
      <h1>{{ getLang("replyList") }}</h1>
      <p>@{{ replyToName }}</p>
    </div>
    <div class="nexment-reply-container">
      <CommentsArea
        :config="config"
        @reloadFunc="changeLoadingStatus"
        :pageKey="config.pageKey"
        :replyTo="nowReplyToID"
        :replyToOID="nowReplyToOID"
        :replyToName="nowReplyToName"
        :primaryReplyTo="replyToID"
        :primaryReplyToOID="replyToOID"
        :primaryReplyToName="replyToName"
        @resetFunc="resetReply"
        @refetchFunc="refetchData"
      />
      <ul class="nexment-comments-list">
        <li class="nexment-comments-list-item" :id="replyItem.ID.toString()">
          <div
            class="nexment-comments-div nexment-reply-primary"
            @click="handleReplyClick(replyItem)"
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
                <em class="nexment-reply-icon"><Icons name="reply"/></em>
              </h5>
              <p class="nexment-comments-des">{{ replyItem.tag }}</p>
              <div :class="tagContentClass(replyItem)">
                <VueShowdown :markdown="replyItem.content" />
              </div>
            </div>
          </div>
          <div>
            <ul class="nexment-comments-reply-list">
              <div class="nexment-loading" v-if="loadingStatus">
                <ContentLoader :speed="2" :width="700" :height="60">
                  <rect x="52" y="8" rx="3" ry="3" width="100%" height="10" />
                  <rect x="52" y="30" rx="3" ry="3" width="80%" height="10" />
                  <circle cx="20" cy="24" r="20" />
                </ContentLoader>
              </div>
              <div
                class="nexment-comments-list-item-div"
                v-for="item in dataContent"
                :key="item.ID"
                :id="item.ID.toString()"
              >
                <li class="nexment-comments-list-item">
                  <div
                    class="nexment-comments-div"
                    @click="handleReplyClickReply(item)"
                  >
                    <div class="nexment-comments-avatar">
                      <img :src="avatarSrc(item)" />
                      <div
                        v-if="adminBadge(item.name, item.email)"
                        class="nexment-admin-badge"
                      >
                        <Icons name="admin" />
                      </div>
                    </div>
                    <div class="nexment-comments-title">
                      <h5>
                        <a
                          :href="item.link"
                          target="_blank"
                          v-html="item.name"
                        ></a>
                        <span> · </span>
                        <b>{{ commentDate(item) }}</b>
                        <b
                          v-if="item.hasReplies"
                          class="nexment-comments-replyto"
                        >
                          <span> · </span>
                          {{ item.replyList.length }}&nbsp;{{
                            item.replyList.length > 1
                              ? getLang("replies")
                              : getLang("reply")
                          }}
                          <Icons name="down" />
                        </b>
                      </h5>
                      <p class="nexment-comments-des">{{ item.tag }}</p>
                      <div :class="tagContentClass(item)">
                        <VueShowdown :markdown="item.content" />
                      </div>
                    </div>
                  </div>
                </li>
                <div v-if="item.hasReplies && modalVisibility[item.OID]">
                  <div class="nexment-modal-replies">
                    <modal
                      :name="'repliesModal' + item.OID"
                      :adaptive="true"
                      height="90vh"
                      @closed="closeModal(item.OID)"
                    >
                      <div class="nexment-modal-header">
                        <a @click="closeModal(item.OID)">
                          <Icons name="modalCancel" />
                        </a>
                      </div>
                      <div>
                        <RepliesList
                          :dataContent="item.replyList"
                          :pageKey="pageKey"
                          :replyToID="item.ID"
                          :replyToOID="item.OID"
                          :replyToName="item.name"
                          :replyItem="item"
                          :config="config"
                          @refetchFunc="refetchData"
                        />
                      </div>
                    </modal>
                  </div>
                </div>
              </div>
              <div v-if="!dataContent.length" class="nexment-empty">
                <div><Icons name="comments" /></div>
                <p>{{ getLang("noComments") }}</p>
              </div>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
/** 
  Reply list
*/
import "@/assets/style/commentslist.scss";
// NOTE: Replace with 'vue' when migrating to Vue 3
import { defineComponent, reactive } from "@vue/composition-api";

// SWRV feature (Composition API required)
import useSWRV from "swrv";
import listFetcher from "@/lib/database/getCommentsList";

// Using require to avoid type error
const ContentLoader = require("vue-content-loader").ContentLoader;

// Icons
import Icons from "@/components/icons/index.vue";

// Avatar library
const md5 = require("js-md5");

// Date formatting library
import { format } from "timeago.js";

// Comment area component
import CommentsArea from "@/components/sections/CommentsArea.vue";

// i18n
import getLang from "@/configs/languages";

export default defineComponent({
  name: "RepliesList",
  props: [
    "dataContent",
    "pageKey",
    "replyToID",
    "replyToOID",
    "replyToName",
    "replyItem",
    "config",
  ],
  components: {
    ContentLoader,
    Icons,
    CommentsArea,
  },
  data() {
    return {
      loadingStatus: false,
      nowReplyToID: this.replyToID,
      nowReplyToOID: this.replyToOID,
      nowReplyToName: this.replyToName,
      modalVisibility: [],
    } as {
      [propsName: string]: any;
    };
  },
  setup(props: any) {
    const { data, error } = useSWRV(
      props.config.pageKey,
      listFetcher(props.config)
    );
    return {
      data,
      error,
      getLang,
    };
  },
  methods: {
    closeModal(OID: string) {
      this.$modal.hide("repliesModal" + OID);
      this.$set(this.modalVisibility, OID, false);
    },
    handleReplyClick(item: any) {
      this.nowReplyToID = item.ID;
      this.nowReplyToOID = item.OID;
      this.nowReplyToName = item.name;
      window.location.href = "#nexment-comment-area";
    },
    handleReplyClickReply(item: any) {
      if (item.hasReplies) {
        this.$set(this.modalVisibility, item.OID, true);
        // 数据渲染延迟处理
        setTimeout(() => {
          this.$modal.show("repliesModal" + item.OID);
        }, 0);
      } else {
        this.nowReplyToID = item.ID;
        this.nowReplyToOID = item.OID;
        this.nowReplyToName = item.name;
        window.location.href = "#nexment-comment-area";
      }
    },
    adminBadge(name: string, email: string) {
      if (
        name === this.$props.config.admin.name &&
        email === this.$props.config.admin.email
      ) {
        return true;
      } else {
        return false;
      }
    },
    tagContentClass(item: any) {
      return "nexment-comments-content " + (item.tag ? "" : "margin-top");
    },
    avatarSrc(item: any) {
      return "https://gravatar.loli.net/avatar/" + md5(item.email) + "?d=mp";
    },
    commentDate(item: any) {
      return format(item.date);
    },
    changeLoadingStatus() {
      this.loadingStatus = !this.loadingStatus;
    },
    resetReply() {
      this.nowReplyToID = "";
      this.nowReplyToOID = "";
      this.nowReplyToName = "";
    },
    refetchData() {
      this.$emit("refetchFunc");
    },
  },
});
</script>
