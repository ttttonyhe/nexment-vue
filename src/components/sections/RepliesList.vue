<template>
  <div>
    <div class="nexment-modal-text">
      <h1>回复列表</h1>
      <p>@{{ replyToName }}</p>
    </div>
    <div class="nexment-reply-container">
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
                <ContentLoader :speed="2" :width="700">
                  <rect x="52" y="8" rx="3" ry="3" width="100%" height="10" />
                  <rect x="52" y="30" rx="3" ry="3" width="80%" height="10" />
                  <rect x="52" y="56" rx="3" ry="3" width="6" height="38" />
                  <rect x="69" y="56" rx="3" ry="3" width="60%" height="6" />
                  <rect x="69" y="72" rx="3" ry="3" width="50%" height="6" />
                  <rect x="69" y="88" rx="3" ry="3" width="30%" height="6" />
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
                          {{ item.replyList.length }} 条回复
                          <Icons name="down" />
                        </b>
                        <em class="nexment-reply-icon-reply">
                          <Icons name="reply" />
                        </em>
                      </h5>
                      <p class="nexment-comments-des">{{ item.tag }}</p>
                      <div :class="tagContentClass(item)">
                        <VueShowdown :markdown="item.content" />
                      </div>
                    </div>
                  </div>
                </li>
              </div>
              <div v-if="!dataContent.length" class="nexment-empty">
                <div><Icons name="comments" /></div>
                <p>暂无评论</p>
              </div>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import "../../assets/style/commentslist.scss";
// NOTE: Replace with 'vue' when migrating to Vue 3
import { defineComponent, reactive } from "@vue/composition-api";

// SWRV feature (Composition API required)
import useSWRV from "swrv";
import listFetcher from "../../lib/database/getCommentsList";

// Using require to avoid type error
const ContentLoader = require("vue-content-loader").ContentLoader;

import Icons from "../icons/index.vue";
const md5 = require("js-md5");
import { format } from "timeago.js";
import Vue from "vue";
import VueShowdown from "vue-showdown";
import { markDownConfigs } from "../../configs/index";
Vue.use(VueShowdown, markDownConfigs);

export default defineComponent({
  name: "RepliesList",
  props: [
    "dataContent",
    "replyTo",
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
  },
  data() {
    return {
      loadingStatus: false,
      nowReplyToID: null,
      nowReplyToOID: null,
      nowReplyToName: null,
      nowRandomNumber: 0,
    } as {
      [propsName: string]: any;
    };
  },
  setup(props: any) {
    console.log(props);
    const { data, error } = useSWRV(props.config.pageKey, listFetcher(props.config));
    return {
      data,
      error,
    };
  },
  methods: {
    handleReplyClick(item: any) {
      this.nowReplyToID = item.ID;
      this.nowReplyToOID = item.OID;
      this.nowReplyToName = item.name;
      this.nowRandomNumber = Math.random();
      window.location.href = "#nexment-comment-area";
    },
    handleReplyClickReply(item: any) {
      if (item.hasReplies) {
      } else {
        this.nowReplyToID = item.ID;
        this.nowReplyToOID = item.OID;
        this.nowReplyToName = item.name;
        this.nowRandomNumber = Math.random();
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
  },
});
</script>
