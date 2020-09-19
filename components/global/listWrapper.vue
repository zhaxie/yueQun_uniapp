<template>
  <view>
    <view v-if="dataListObj.list">
      <view class="DATALIST" v-if="dataListObj.list.length > 0">
        <slot></slot>
      </view>
      <view class="position-fixed center-text-tips" v-else-if="dataListObj.list.length === 0">暂无数据~</view>
      <view
        class="d-flex align-items-center justify-content-center list-bottom-text"
        v-if="dataListObj.lastPage > dataListObj.currentPage "
      >
        <view class="iconfont icon-loading"></view>
        <span class="ml-10">加载中，请稍候~</span>
      </view>
      <view
        class="text-center list-bottom-text DATAENDTIPS"
        v-else-if="isRenderLoadedListEndTips && dataListObj.lastPage === dataListObj.currentPage"
      >到底了，没有更多了~</view>
    </view>
    <view
      class="position-fixed center-text-tips"
      v-else-if="!dataListObj.list && !dataListObj.hideCenterLoadingText"
    >拼命加载中，请稍候~</view>
  </view>
</template>

<script>
export default {
  props: {
    dataListObj: {
      type: Object,
    },
  },
  data() {
    return {
      isRenderLoadedListEndTips: null,
    };
  },
  watch: {
    dataListObj(newDataListObj) {
      const currentPage = newDataListObj.currentPage;

      console.info("dataListObj", newDataListObj);

      if (newDataListObj && currentPage) {
        if (currentPage === 1) {
          console.info("计算节点", "");
          console.info("ths", this.handleIsRenderLoadedListEndTips);
          this.handleIsRenderLoadedListEndTips(); //是否显示
        } else {
          if (!this.isRenderLoadedListEndTips) {
            this.isRenderLoadedListEndTips = true;
          }
        }
      }
    },
  },
  methods: {
    async handleIsRenderLoadedListEndTips() {
      await this.$nextTick();

      const winHeight = await this.getWinHeight();
      const dataListHeight = await this.getDataListHeight();

      console.info("winHeight", winHeight);
      console.info("dataListHeight", dataListHeight);

      this.isRenderLoadedListEndTips = dataListHeight > winHeight; // list高度 > 屏幕高度 && '到底了，没更多'
    },
    async getWinHeight() {
      var windowHeight =
        this.windowHeight ||
        (this.windowHeight = await uni.getSystemInfoSync().windowHeight);

      return windowHeight;
    },
    getDataListHeight() {
      console.info("getDataListHeight");

      return new Promise((resolve) => {
        let menuButton = uni.getMenuButtonBoundingClientRect();

        const domQuery = uni.createSelectorQuery().in(this);
        const boundingClientRect = domQuery
          .select(".DATALIST")
          .boundingClientRect();

        boundingClientRect.exec((res) => {
          resolve(res[0] ? res[0].height : 0);
        });
      });
    },

    openToWin(e) {
      console.info("e", e);
      const name = e.currentTarget.dataset.pagename;

      console.info("name", name);
      uni.$router.push({
        name,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.center-text-tips {
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  -webkit-transform: translate3d(-50%, -50%, 0);
  font-size: 14px;
  color: #999;
}

.list-bottom-text {
  line-height: 88rpx;
  font-size: 0.75rem;
  color: #999;
}

@keyframes rotate360 {
  from {
    transform: rotate(360deg);
  }
  to {
  }
}

.icon-loading {
  animation: rotate360 2s 0.2s linear infinite;
}
</style>