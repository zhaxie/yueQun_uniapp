<template>
  <!-- 模块内容 -->
  <view class="d-flex flex-wrap pl-30 pr-10 goods-list">
    <view class="col-6" v-for="(item, index) in goodsList" :key="index" @click="handleOpenToWin('goodsDetails?id=' + item.goods_id)">
      <view class="mr-20 mb-20 content-item">
        <view class="position-relative item-img">
          <imgWithLoading class="position-absolute imgCover" :src="item.pic_small[0]"></imgWithLoading>
        </view>
        <view class="pa-20 item-footer">
          <view class="mb-15 text-over-one footer-title">{{item.name}}</view>
          <view class="d-flex align-items-baseline flex-wrap price-saleNum">
            <view class="state">￥</view>
            <view class="mr-auto price">{{item.price}}</view>
            <view class="ml-20 my-10 sale-num">已售{{item.sales}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    goodsList: {
      type: Array,
    },
  },
  methods: {
    handleOpenToWin(fullPath) {
      uni.$router.push(fullPath);
    },

    onDevelopingTips() {
      uni.$com.onDevelopingTips();
    },
  },
};
</script>

<style lang="scss" scoped>
/* 热销产品 */
.goods-list .content-item {
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
}
.goods-list .content-item .item-img {
  padding-bottom: 100%;
}

.goods-list .content-item .item-footer .footer-title {
  font-size: 14px;
  color: #000000;
}
.goods-list .content-item .item-footer .state {
  font-size: 13px;
  color: #f3283c;
}
.goods-list .content-item .item-footer .price {
  font-weight: bold;
  font-size: 18px;
  letter-spacing: -0.7rpx;
  color: #f2243b;
}
.goods-list .content-item .item-footer .sale-num {
  font-size: 11px;
  letter-spacing: -0.4rpx;
  color: #606060;
}
</style>