<template>
  <!-- 模块：热门团购 -->
  <view class="pb-30 hot-group-modules">
    <view class="mx-auto my-30" style="width: 160rpx">
      <view class="position-relative hot-title">
        <imgWithLoading
          class="position-absolute imgCover"
          :src="require('@/static/icon/hot-recomand-title.png')"
        ></imgWithLoading>
      </view>
    </view>
    <scroll-view scroll-x>
      <view class="px-30">
        <view class="d-flex goods-list">
          <view class="col-4" v-for="(item, index) in 4" :key="index">
            <view class="goods-item">
              <view class="position-relative img-box">
                <imgWithLoading
                  class="position-absolute imgCover"
                  src="https://csjl-1259532874.cos.ap-shanghai.myqcloud.com/uploads/activity/20200914/202009141858215147519.png?imageMogr2/interlace/1/thumbnail/750x"
                ></imgWithLoading>
              </view>
              <view class="mt-10 text-over-one goods-title">敷尔佳 医用透</view>
              <view class="goods-price">￥20</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
//模块：热门团购
.hot-group-modules {
  border-bottom: 20rpx solid #f3f3f3;

  .hot-title {
    padding-bottom: 20%;
  }

  .goods-list {
    margin-right: -20rpx;

    .goods-item {
      padding-right: 20rpx;

      .img-box {
        padding-bottom: 100%;
        border-radius: 10rpx;
        overflow: hidden;
      }

      .goods-title {
        font-size: 26rpx;
        color: #79585e;
      }

      .goods-price {
        font-size: 32rpx;
        color: #ff6565;
      }
    }
  }
}
</style>