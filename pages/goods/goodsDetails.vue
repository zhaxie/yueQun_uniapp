<template>
  <view>
    <navBar></navBar>
    <block v-if="goodsDetails">
      <!-- 商品轮播图 -->
      <goodsBannerSwiper :imgList="initOptions_banner"></goodsBannerSwiper>
      <!-- 商品信息 -->
      <view class="px-30 goods-info-modules">
        <view class="d-flex align-items-baseline pt-30 pb-20 price-bar">
          <view class="state">￥</view>
          <view class="price">{{goodsDetails.price}}</view>
        </view>
        <view class="text-over-two title">{{goodsDetails.name}}</view>
        <view class="d-flex align-items-center pb-10 sale-bar">
          <view class="col">已售{{goodsDetails.sales || 0}}</view>
          <button
            class="d-flex align-items-center py-20"
            style="width: auto;"
            open-type="share"
            hover-class="none"
          >
            <view class="iconfont">
              <image class="imgCover" mode="aspectFill" src="/static/icon/com_share.png" />
            </view>
            <view>分享</view>
          </button>
        </view>
      </view>
      <!-- 商品详情 -->
      <view class="goods-content" v-if="goodsDetails.content">
        <view class="pa-30 title">商品详情</view>
        <view v-html="goodsDetails.content"></view>
      </view>
    </block>
  </view>
</template>

<script>
import goodsBannerSwiper from "@/components/goodsBannerSwiper.vue";

export default {
  components: {
    goodsBannerSwiper,
  },
  data() {
    return {
      goodsDetails: null,
      initOptions_banner: [],
    };
  },
  onShareAppMessage() {
    return {};
  },
  onLoad: function (options) {
    const { id: goodsID } = (this.options = options);
    this.getAndSetGoodsDetailsByID(goodsID);
  },
  methods: {
    async getAndSetGoodsDetailsByID(goodsID) {
      try {
        const { res } = await uni.$ajax({
          apiKey: "getGoodsDetailsByID",
          data: {
            goods_id: goodsID,
          },
        });

        this.goodsDetails = res;
        this.initOptions_banner = res.pic.filter((item) => item);

      } catch (error) {
        uni.$catchError(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* pages/goods/goodsDetails/goodsDetails.wxss */

/* 商品信息 */
.goods-info-modules {
}
.goods-info-modules .price-bar{
    color: #f2243b;
}

.goods-info-modules .price-bar .state{
	font-size: 13px;
}

.goods-info-modules .price-bar .price{
	font-size: 20px;
}
.goods-info-modules .title{
	font-size: 17px;
	color: #000000;
}
.goods-info-modules .sale-bar{
	font-size: 11px;
	color: #606060;
}

/* 商品详情 */
.goods-content .title{
    border-top: 20rpx solid #f5f5f5;
    font-size: 15px;
    color: #000;
}
</style>