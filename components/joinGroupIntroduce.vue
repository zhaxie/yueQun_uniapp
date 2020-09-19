<template>
    <!-- 模块：团购攻略 -->
    <view class="o-hidden take-order-tips-modules" v-once>
      <!-- 攻略：标题 -->
      <view class="d-flex align-items-center py-30 px-40 title-box">
        <view class="col div-line"></view>
        <view class="d-flex align-items-center center-title">团购攻略</view>
        <view class="col div-line"></view>
      </view>

      <!-- 攻略：图标 -->
      <view class="position-relative d-flex align-items-center icon-list">
        <view
          class="position-relative z100 col"
          v-for="(item, index) in 4"
          :key="index"
        >
          <view class="mx-auto iconfont icon-item"></view>
        </view>
      </view>

      <!-- 攻略：图标文字 -->
      <view class="pt-20 pb-30 d-flex align-items-center icon-text-list">
        <view class="text-center col" v-for="(item, index) in 4" :key="index">
          文字
        </view>
      </view>
    </view>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
//模块：团购攻略
.take-order-tips-modules {
  background-color: #fef9ef;

  // 团购攻略: 标题
  .title-box {
    .div-line {
      height: 1rpx;
      background-color: #fac880;
    }

    .center-title {
      font-weight: bold;
      font-size: 28rpx;
      color: #ff9839;

      &::before,
      &::after {
        content: "";
        display: block;
        width: 10rpx;
        height: 10rpx;
        background-color: #fac880;
        border-radius: 50%;
      }

      &::before {
        margin-right: 20rpx;
      }

      &::after {
        margin-left: 20rpx;
      }
    }
  }

  //攻略：图标
  .icon-list {
    margin-left: -20rpx;
    margin-right: -20rpx;

    .icon-item {
      width: 70rpx;
      height: 70rpx;
      border-radius: 50%;
      border: 10rpx solid #fef9ef;
      background-color: #fac880;
    }

    &::after {
      position: absolute;
      left: 16%;
      right: 16%;
      top: 50%;
      bottom: 0;
      margin: auto;
      content: "";
      display: block;
      border-top: 1px dashed #fac880;
    }
  }

  //攻略：图标文字
  .icon-text-list {
    margin-left: -20rpx;
    margin-right: -20rpx;
    font-size: 28rpx;
    color: #ff942e;
  }
}
</style>