<template>
  <view>
    <navBar></navBar>
    <view v-if="clientInfo.name">
      <view class="px-40 header-title">{{clientInfo.name || '暂无'}}</view>
      <view class="px-40 py-20 o-hidden content-list">
        <view class="d-flex align-items-center my-20 content-item">
          <view class="col-3 title">联系方式：</view>
          <view class="content">{{clientInfo.phone || '暂无'}}</view>
        </view>
        <view class="d-flex align-items-center my-20 content-item">
          <view class="col-3 title">联系地址：</view>
          <view class="content">{{clientInfo.address || '暂无'}}</view>
        </view>
        <view class="d-flex align-items-center my-20 content-item">
          <view class="col-3 title">所属分组：</view>
          <view class="content">{{clientInfo.grouping || '暂无'}}</view>
        </view>
      </view>
    </view>
    <noDataTips v-else>暂无数据~</noDataTips>
  </view>
</template>

<script>
export default {
  data() {
    return {
      clientInfo: {},
    };
  },
  onLoad(){
      this.getAndSetUserInfo();
  },
  methods: {
    //获取并设置用户信息
    async getAndSetUserInfo() {
      try {
        const { res } = await uni.$ajax({
          apiKey: "getUserInfo",
        });

        this.clientInfo = res.client_info;
      } catch (error) {
        uni.$catchError(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header-title {
  padding-top: 60rpx;
  padding-bottom: 60rpx;
  font-size: 32rpx;
  color: #ffffff;
  background-color: #3079ec;
}

.content-list {
  background-color: #fff;
}
.content-list .content-item .title {
  font-size: 15px;
  color: #606060;
}

.content-list .content-item .content {
  font-size: 15px;
  color: #000000;
}
</style>