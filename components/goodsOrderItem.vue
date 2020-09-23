<template>
  <view class="d-flex">
    <view class="col-3">
      <view class="position-relative item-img">
        <imgWithLoading
          class="position-absolute imgCover"
          withoutDomainName="true"
          src="/assets/img/test-banner-1.png"
        ></imgWithLoading>
      </view>
    </view>
    <view class="mx-20 col">
      <view class="text-over-two item-title">{{initOptions.name}}</view>
      <view class="text-over-one my-10 item-symbol">{{initOptions.unit_name}}</view>
    </view>
    <view>
      <view class="d-flex align-items-baseline">
        <view class="price-state">￥</view>
        <view class="price">{{initOptions.price}}</view>
      </view>
      <view class="text-right quantity">X{{initOptions.num}}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    initOptions: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.item-img {
  padding-bottom: 100%;
  overflow: hidden;
  border-radius: 10rpx;
}
.item-title {
  font-size: 14px;
  color: #000000;
}
.item-symbol {
  font-size: 13px;
  color: #787878;
}
.price-state {
  font-size: 13px;
  color: #333333;
}
.price {
  font-weight: bold;
  font-size: 15px;
  color: #333333;
}
.quantity {
  font-size: 11px;
  color: #999999;
}
</style>