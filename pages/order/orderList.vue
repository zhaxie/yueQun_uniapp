<template>
  <view>
    <navBar></navBar>
    <listWrapper :dataListObj="dataListObj">
      <view class="order-list">
        <view
          class="ma-30 order-item"
          v-for="item in dataListObj.list"
          :key="item.order_id"
          @click="handleOpenToWin('orderDetails?id=' + item.order_id)"
        >
          <view class="d-flex align-items-center my-30 item-top">
            <view class="col text-over-one mr-20 label">订单编号：{{item.order_no}}</view>
            <view class="status">交易成功</view>
          </view>
          <!-- 商品信息 -->
          <view class="my-20" v-for="(itemInfo, itemIndex) in item.info" :key="itemIndex">
            <goodsOrderItem :initOptions="itemInfo"></goodsOrderItem>
          </view>
          <!-- 价格 -->
          <view class="d-flex align-items-baseline justify-content-end my-40 price-bar">
            <view class="state">总价￥</view>
            <view class="mr-10 light-price">{{item.total_price}}</view>
            <view class="state">优惠￥</view>
            <view class="mr-10 light-price">0.00</view>
            <view class="state" style="color: #000">实付款￥</view>
            <view class="ture-price">{{item.total_price}}</view>
          </view>
          <!-- 按钮 -->
          <view class="d-flex align-items-center justify-content-end my-40 bottom-action-btns">
            <!-- <view class="px-30 ml-30 btn-items" hover-class="hover-bg-f4" catch:tap="delecteT!hisItem" data-item="{{item}}">
                    删除订单
            </view>-->
            <view
              class="px-30 ml-30 btn-items"
              hover-class="hover-bg-f4"
            >查看订单</view>
          </view>
        </view>
      </view>
    </listWrapper>
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
      dataListObj: {
        list: null,
        currentPage: 0,
        lastPage: 0,
      },
    };
  },

  onPullDownRefresh() {
    this.init();
  },

  onReachBottom: function () {
    this.getAndSetDataList({
      isGetNewList: false,
    });
  },

  onLoad() {
    this.init();
  },

  methods: {
    async init() {
      this.getAndSetDataList({
        isGetNewList: true,
      });
    },

    async getAndSetDataList({ isGetNewList }) {
      try {
        let dataListObj = this.dataListObj;

        if (isGetNewList === true) {
          dataListObj.currentPage = null;
          dataListObj.lastPage = null;
        }

        const _currentPage = dataListObj.currentPage || 0;
        const _lastPage = dataListObj.lastPage || 1;

        if (_currentPage >= _lastPage) {
          console.info("最后一页了");
          return false;
        }

        const { res } = await uni.$ajax({
          apiKey: "getOrderList",
          data: {
            page: _currentPage - 1 + 2,
            // paginate: 3,
          },
        });

        const {
          current_page: currentPage,
          last_page: lastPage,
          data: list,
        } = res;

        const existedList = dataListObj.list || [];

        dataListObj.list =
          isGetNewList === true ? list : existedList.concat(list);
        dataListObj.currentPage = Number(currentPage);
        dataListObj.lastPage = Number(lastPage);
      } catch (error) {
        uni.$catchError(error);
      } finally {
        uni.stopPullDownRefresh();
      }
    },

    handleOpenToWin(fullPath) {
      uni.$router.push(fullPath);
    },
  },
};
</script>

<style>
page {
  background: #f5f5f5;
}
</style>

<style lang="scss" scoped>
.order-list {
  overflow: hidden;
}

.order-list .order-item {
  padding-left: 22rpx;
  padding-right: 22rpx;
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
}
.order-list .order-item .item-top .label {
  font-size: 14px;
  color: #010101;
}
.order-list .order-item .item-top .status {
  font-size: 13px;
  color: #3079ec;
}
.order-list .order-item .price-bar .state {
  font-size: 13px;
  color: #787878;
}
.order-list .order-item .price-bar .light-price {
  font-size: 15px;
  color: #787878;
}
.order-list .order-item .price-bar .ture-price {
  font-size: 15px;
  color: #000;
}

.order-list .order-item .bottom-action-btns .btn-items {
  line-height: 58rpx;
  border-radius: 29rpx;
  border: 1px solid #ccc;
  font-size: 13px;
  color: #606060;
}
</style>