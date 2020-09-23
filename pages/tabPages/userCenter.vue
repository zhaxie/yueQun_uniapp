<template>
  <view class="d-flex flex-column" style="height: 100vh">
    <navBar></navBar>
    <view class="col main-content" v-if="userInfo">
      <view class="position-relative d-flex align-items-center pl-40 py-40 mx-30 user-info">
        <view class="col text-over-one">
          <view class="text-over-one tilte">{{userInfo.client_info.name || '暂无客户资料'}}</view>
          <view
            class="pt-20 label"
          >{{userInfo.client_info.grouping || '暂无分组'}}{{' ' + (userInfo.client_info.phone || '')}}</view>
        </view>
        <view
          class="d-flex align-items-center pr-30 change-role-btn"
          @click="handleOpenToWin('clientList')"
        >
          <view>切换</view>
          <view class="iconfont icon-right"></view>
        </view>
      </view>
      <view class="ma-30 content-list">
        <view
          class="position-relative d-flex align-items-center pa-30 content-item"
          v-for="(item) in mainContentList"
          :key="item.name"
          @click="handleTapEntryBar(item)"
        >
          <view class="d-flex align-items-center justify-content-center mr-20 item-icon">
            <view class="iconfont" :class="item.iconfontClass"></view>
          </view>
          <view class="col">{{item.name}}</view>
          <view class="iconfont">
            <image class="imgCover" src="/static/icon/com_lookMore.png" mode="aspectFill" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mainContentList: [],
      userInfo: null,
    };
  },
  onShareAppMessage() {
    return {};
  },

  onLoad(options) {
    uni.$bus.on("changeClientInfo", (newClientInfo) => {
      this.userInfo.client_info = newClientInfo;

      uni.$router.back(-1);
    });

    this.init();
  },

  methods: {
    async init() {
      try {
        const { res } = await uni.$ajax({
          apiKey: "getUserInfo",
        });

        this.userInfo = res;
        this.mainContentList = await this.getMainContentList();
      } catch (error) {
        uni.$catchError(error);
      }
    },
    getMainContentList() {
      return [
        {
          name: "我的订单",
          iconfontClass: "icon-order",
          onTap: () => {
            uni.$router.push({
              name: "orderList",
            });
          },
        },
        {
          name: "userClientInfo",
          name: "我的资料",
          iconfontClass: "icon-idCard",
          onTap: async () => {
            uni.$router.push({
              name: "clientDetails",
            });
          },
        },
      ];
    },

    handleTapEntryBar(entryDetails) {
      entryDetails.onTap && entryDetails.onTap(entryDetails);
    },

    handleOpenToWin(fullPath) {
      uni.$router.push(fullPath);
    },
  },
};
</script>

<style>
page {
  background-color: #3079ec;
}
</style>

<style lang="scss" scoped>
.main-content {
  margin-top: 120rpx;
  background-color: #f5f5f5;
}

.user-info {
  background-color: #ffffff;
  box-shadow: 0rpx 14rpx 16rpx 0rpx rgba(150, 150, 150, 0.07);
  border-radius: 20rpx;
  margin-top: -98rpx;
}
.user-info .tilte {
  font-weight: bold;
  font-size: 16px;
  color: #000000;
}
.user-info .label {
  font-size: 14px;
  color: #999999;
}

.user-info .change-role-btn {
  font-size: 13px;
  color: #3079ec;
}

.user-info .change-role-btn .icon-right {
  font-size: 14px;
  width: 32rpx;
  height: 32rpx;
  margin-bottom: -4rpx;
}
.content-list {
  box-shadow: 0rpx 14rpx 16rpx 0rpx rgba(150, 150, 150, 0.07);
  border-radius: 20rpx;
  background-color: #fff;
  font-size: 16px;
  color: #4d4d4d;
}
.content-list .content-item:not(:first-child)::after {
  position: absolute;
  left: 36rpx;
  right: 36rpx;
  top: 0;
  content: "";
  display: block;
  height: 1px;
  background-color: #eaeaea;
}
.content-list .content-item .item-icon {
  width: 54rpx;
  height: 54rpx;
  background-color: #f2f7ff;
  border-radius: 50%;
  color: #3079ec;
}

.content-list .content-item .item-icon .iconfont {
  font-size: 20px;
}
</style>