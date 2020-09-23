<template>
  <view>
    <navBar></navBar>
    <!-- 还未开发的提示 -->
    <view class="position-fixed undevelop-tips">
      <imgWithLoading :withoutDomainName="true" src="/static/img/undevelop_cart_tips.png"></imgWithLoading>
    </view>
  </view>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
/* pages/tabPages/shopCart/shopCart.wxss */

.undevelop-tips{
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 334rpx;
    height: 228rpx;
}
</style>