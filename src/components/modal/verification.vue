<template>
  <modal
    name="verifyCard"
    :adaptive="true"
    @closed="modalCloseHandler"
    classes="nexment-verification-modal"
  >
    <div class="nexment-modal-notification">
      <div>
        <div class="nexment-modal-text">
          <h1>{{ getLang("verification") }}</h1>
          <p>{{ getLang("verifyDes") }}</p>
        </div>
        <div class="nexment-modal-input-group">
          <input :placeholder="getLang('verifyPwd')" v-model="password" />
          <button @click="loginAction">{{ loginText }}</button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
/** 
  Admin verification modal
*/
import { defineComponent } from "@vue/composition-api";
import adminLogin from "@/lib/database/adminLoging";

// i18n
import getLang from "@/configs/languages";

export default defineComponent({
  name: "Verification",
  props: ["config"],
  data() {
    return {
      loginText: "登录",
      password: null,
    };
  },
  setup() {
    return {
      getLang,
    };
  },
  mounted() {
    this.$modal.show("verifyCard");
  },
  methods: {
    closeModal() {
      this.$modal.hide("verifyCard");
    },
    modalCloseHandler() {
      this.$emit("closeFunc");
    },
    async loginAction() {
      this.loginText = "验证中...";
      const returnData = await adminLogin(
        this.config.admin.name,
        this.config.admin.email,
        this.password || "",
        this.config
      );
      if (returnData.status !== 200) {
        alert(returnData.msg);
        this.loginText = "登录";
      } else {
        this.loginText = "验证成功";
        this.handleCloseNotification();
      }
    },
    handleCloseNotification() {
      this.closeModal();
      this.modalCloseHandler();
    },
  },
});
</script>
