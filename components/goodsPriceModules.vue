<template>
  <!-- 模块：价格和倒计时 -->
  <view class="price-outtime-modules">
    <view class="d-flex align-items-center">
      <view class="col left-box">
        <view class="d-flex align-items-center h-100">
          <view class="mx-20 my-20 time-icon">
            <imgWithLoading
              :src="require('@/static/icon/other_xianshibaokuan.png')"
            ></imgWithLoading>
          </view>
          <view class="col left-center-box">
            <view class="d-flex align-items-baseline">
              <view class="state">¥</view>
              <view class="value">{{ goodsInfoObj.currentPrice }}</view>
              <view class="ml-10 original-price"
                >¥{{ goodsInfoObj.originalPrice }}</view
              >
            </view>
            <view class="stock-number">库存:{{ goodsInfoObj.stockQty }}</view>
          </view>
          <view class="px-20 mr-30 buyyed-number"
            >{{ goodsInfoObj.saleUserQty }}人已抢</view
          >
        </view>
      </view>
      <view class="col-3 right-box">
        <view class="d-flex justify-content-center">
          <view class="d-flex flex-column align-items-start">
            <view class="mb-5 label">距离结束还剩：</view>
            <view
              class="d-flex align-items-center justify-content-center outtime-list"
            >
              <uni-countdown
                v-if="endTime"
                :show-day="endTime.days > 0"
                :day="endTime.days"
                :hour="endTime.hours"
                :minute="endTime.minutes"
                :second="endTime.seconds"
                fontSpan="2"
              ></uni-countdown>

              <!-- <view class="outtime-item">23</view>
              <view class="mx-5 state">:</view>
              <view class="outtime-item">23</view>
              <view class="mx-5 state">:</view>
              <view class="outtime-item">23</view> -->
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    goodsInfoObj: {
      type: Object,
    },
  },
  data() {
    return {
      // endTime: value
    }
  },
  computed: {
    //倒计时
    endTime() {
      const goodsInfoObj = this.goodsInfoObj;

      if (goodsInfoObj && goodsInfoObj.endDt) {
        const diffTime = uni.$com.diffTime;
        const endTime = diffTime(new Date(), goodsInfoObj.endDt);

        console.info('endTime', endTime);

        return endTime;
      }
    }
  },
}
</script>


<style lang="scss" scoped>



// 模块：价格和倒计时
.price-outtime-modules {
  background-color: #fdf1e7;
  border-bottom-left-radius: 30rpx;
  border-bottom-right-radius: 30rpx;

  // 左边
  .left-box {
    border-radius: 0rpx 50rpx 50rpx 30rpx;
    background: linear-gradient(318deg, #ffba43 0%, #ff3a5d 45%, #ff3a5d 100%);

    .time-icon {
      width: 70rpx;
      height: 70rpx;
    }

    .left-center-box {
      .state {
        font-size: 24rpx;
        color: #fff;
      }

      .value {
        font-weight: bold;
        font-size: 44rpx;
        color: #fff;
      }

      .original-price {
        text-decoration: line-through;
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.53);
      }

      .stock-number {
        font-size: 20rpx;
        color: rgba(255, 255, 255, 0.53);
      }
    }

    .buyyed-number {
      line-height: 38rpx;
      border-radius: 38rpx;
      background-color: #fff;
      font-size: 24rpx;
      color: #ff9458;
    }
  }

  // 右边
  .right-box {
    .label {
      font-size: 22rpx;
      color: #fb843d;
    }

    .outtime-list {
      .outtime-item {
        width: 34rpx;
        height: 34rpx;
        line-height: 34rpx;
        background: linear-gradient(360deg, #ff4386 0%, #ffb943 100%);
        border-radius: 4rpx;
        text-align: center;
        font-size: 24rpx;
        color: #fff;
      }

      .state {
        font-size: 24rpx;
        color: #ff863e;
      }
    }
  }
}
</style>