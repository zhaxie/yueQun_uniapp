<template>
  <mask class="MASK" ref="mask">
    <view
      class="fixed-bottom w-100 animated faster bindMobile-modules"
      :class="isRemoveAchievement ? 'slideOutDown' : 'slideInUp'"
    >
      <view class="mx-30">
        <view class="d-flex align-items-center py-30">
          <view class="mr-10 icon-logo">
            <imgWithLoading withoutDomainName="true" src="/static/icon/icon-logo.png"></imgWithLoading>
          </view>
          <view class="mr-30 app-name">越群轻松订</view>
          <view class="apply-text">申请使用</view>
        </view>
        <view class="apply-text-2">你的手机号码</view>
        <button
          class="com-big-btn big-button"
          open-type="getPhoneNumber"
          @getphonenumber="handleBindMobile"
        >手机号码授权登录</button>
      </view>
    </view>
  </mask>
</template>

<script>
export default {
  methods: {
    async render(initOptions) {
      this.initOptions = initOptions;

      this.$refs.mask.render({
        removeByTapMask: true,
        ok: () => {
          this.isRemoveAchievement = false;
        },
        cancel: () => {
          this.isRemoveAchievement = true;
        },
      });
    },

    handleCloseDialog() {
      this.$refs.mask.removeMask();
    },

    //绑定手机号
    async handleBindMobile(e) {
      console.info("e", e);
      try {
        if (this.isSubmitted_bindMobile === true) return true;

        const { encryptedData, iv } = e.detail || {};

        if (!encryptedData || !iv) {
          throw "服务需要，请授权手机号";
        }

        this.isSubmitted_bindMobile = true;

        const { msg } = await uni.$ajax({
          apiKey: "bindMobile",
          isRequestOnce: true,
          data: {
            check_bind: 0, //验证是否绑定手机号码 1是
            encryptedData,
            iv,
          },
        });
        const initOptions = this.initOptions;

        console.info("initOptions", initOptions);

        initOptions && initOptions.success(true);

        uni.$toast({
          msg,
        });
      } catch (error) {
        delete this.isSubmitted_bindMobile;

        uni.$catchError(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bindMobile-modules {
  background-color: #fff;
  border-top-left-radius: 22rpx;
  border-top-right-radius: 22rpx;
}
.bindMobile-modules .icon-logo {
  width: 76rpx;
  height: 76rpx;
}
.bindMobile-modules .app-name {
  font-weight: bold;
  font-size: 17px;
  color: #333333;
}
.bindMobile-modules .apply-text {
  font-size: 16px;
  color: #333333;
}
.bindMobile-modules .apply-text-2 {
  font-weight: bold;
  font-size: 22px;
  color: #333333;
}

.big-button {
  margin-top: 70rpx;
  margin-bottom: 70rpx;
}
</style>