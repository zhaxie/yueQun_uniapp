<template>
  <view>
    <navBar @headerHeight="setMoudlesNamePostionTop"></navBar>
    <!-- 订单状态 -->
    <view
      class="position-sticky z100 d-flex align-items-center order-status"
      :style="{top: modulesPostionTop + 'px'}"
    >
      <view class="mr-20 iconfont">
        <image class="imgCover" mode="aspectFill" src="/static/icon/order_status_success.png" />
      </view>
      <view class="status-text">交易成功</view>
    </view>
    <view class="pa-30 customer-name">客户名称: {{orderDetails.name}}</view>
    <!-- 商品信息 -->
    <view class="px-30 goods-info">
      <view class="py-30 goods-title">商品清单</view>
      <view
        class="my-20"
        v-for="(itemInfo, itemInfoIndex) in orderDetails.order_goods"
        :key="itemInfoIndex"
      >
        <goodsOrderItem :initOptions="itemInfo"></goodsOrderItem>
      </view>
      <view class="py-30 footer-info">
        <view class="d-flex align-items-center mb-15">
          <view class="col label">优惠</view>
          <view class="content">￥0</view>
        </view>
        <view class="d-flex align-items-center big-text">
          <view class="col label">实付款</view>
          <view class="content">￥{{orderDetails.total_price}}</view>
        </view>
      </view>
    </view>
    <!-- 操作记录 -->
    <view class="px-30 mb-40 pb-40 order-action-record">
      <view class="py-30 action-title">订单详情</view>
      <view>
        <view class="d-flex align-items-center mb-20 record-item">
          <view class="col-4">订单编号：</view>
          <text :selectable="true" class="text-over-one">{{orderDetails.order_no}}</text>
        </view>
        <view class="d-flex align-items-center mb-20 record-item">
          <view class="col-4">订货时间：</view>
          <text :selectable="true" class="text-over-one">{{orderDetails.add_time}}</text>
        </view>
        <!-- 暂时注释掉 -->
        <!-- <view class="d-flex align-items-center mb-20 record-item">
            <view class="col-4">付款时间：</view>
            <text selectable="{{true}}" class="text-over-one">{{orderDetails.pay_time}}</text>
        </view>
        <view class="d-flex align-items-center mb-20 record-item">
            <view class="col-4">成交时间：</view>
            <text selectable="{{true}}" class="text-over-one">{{orderDetails.make_time}}</text>
        </view>-->
      </view>
    </view>
    <!-- 底部操作模块 -->
    <!-- <view class="footer-action-modules">
    <view class="position-fixed z100 d-flex align-items-center justify-content-end px-30 footer-action-bar">
        <view class="px-30 ml-30 btn-items">删除订单</view>
        <view class="px-30 ml-30 btn-items">查看订单</view>
    </view>
    </view>-->
  </view>
</template>

<script>
import goodsOrderItem from "@/components/goodsOrderItem.vue";

export default {
  components: {
    goodsOrderItem,
  },
  data() {
    return {
      orderDetails: null,
    };
  },
  onLoad: function (options) {
    console.info("options", options);

    this.options = options;

    const { id: orderID } = options;

    this.getAndSetOrderDetails(orderID);
  },

  methods: {
    async getAndSetOrderDetails(orderID) {
      try {
        if (!orderID) {
          throw "订单id有误";
        }
        const { res } = await uni.$ajax({
          apiKey: "getOrderDetailsByID",
          data: {
            order_id: orderID,
          },
        });

        this.orderDetails = res;
      } catch (error) {
        uni.$catchError(error);
      }
    },
    setMoudlesNamePostionTop(modulesPostionTop) {
      this.modulesPostionTop = modulesPostionTop;
    },
  },
};
</script>

<style lang="scss" scoped>
/* pages/order/orderDetails/orderDetails.wxss */
.order-status {
  left: 0;
  padding-left: 40rpx;
  height: 142rpx;
  background-color: #3079ec;
}
.order-status .status-text {
  font-size: 15px;
  color: #ffffff;
}
.customer-name {
  border-bottom: 20rpx solid #f6f6f6;
  font-size: 14px;
  color: #2b2b2b;
}

/* 商品信息 */
.goods-info {
  border-bottom: 20rpx solid #f6f6f6;
}
.goods-info .goods-title {
  border-bottom: 1px solid #eaeaea;
  font-size: 15px;
  color: #2b2b2b;
}

.goods-info .footer-info {
  border-top: 1px solid #eaeaea;
}
.goods-info .footer-info .label {
  font-size: 12px;
  color: #000000;
}
.goods-info .footer-info .content {
  font-size: 12px;
  color: #000;
}
.goods-info .footer-info .big-text .label {
  font-size: 14px;
  color: #000000;
}
.goods-info .footer-info .big-text .content {
  font-size: 17px;
  color: #f2243b;
}

/* 操作记录 */
.order-action-record .action-title {
  font-size: 15px;
  color: #2b2b2b;
}
.order-action-record .record-item {
  font-size: 13px;
  color: #333333;
}

/* 底部操作模块 */
.footer-action-modules {
  height: 98rpx;
}
.footer-action-modules .footer-action-bar {
  left: 0;
  bottom: 0;
  right: 0;
  height: inherit;
  background-color: #fff;
  box-shadow: 0rpx 8rpx 35rpx 0rpx rgba(36, 37, 38, 0.11);
}
.footer-action-modules .footer-action-bar .btn-items {
  line-height: 58rpx;
  border-radius: 29rpx;
  border: 1px solid #ccc;
  font-size: 13px;
  color: #606060;
}
</style>