<template>
  <view class="position-relative imgCover">
    <!-- 加载中 -->
    <view class="loading-img iconfont icon-loading" v-if="isLoadingImg"></view>
    <!-- 加载失败 -->
    <view
      class="loading-img iconfont icon-load-fail"
      v-if="imgLoadError"
    ></view>
    <!-- 加载成功 -->
    <image
      class="imgCover"
      :src="
        width ? src + '?imageMogr2/interlace/1/thumbnail/' + width + 'x' : src
      "
      :mode="mode || 'aspectFill'"
      :lazy-load="false"
      @error="imgLoadError"
      @load="imgLoadSuccess"
    />
  </view>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
    },
    mode: {
      type: String,
    },
    class: {
      type: String,
    },
    headerImg: {
      type: String,
    },
    type: {
      type: String,
    },
    disWithHost: {
      type: Boolean,
    },
    width: {
      type: String,
    },
  },
  data() {
    return {
      isLoadingImg: true,
    };
  },
  created() {
    console.info("1212", "");
  },
  methods: {
    imgLoadSuccess(e) {
      this.isLoadingImg = false;
      this.imgLoadError = false;
    },
    imgLoadError(e) {
      console.error("imgLoadError", e);

      this.isLoadingImg = false;
      this.imgLoadError = true;
    },
  },
};
</script>

<style scoped>
@keyframes rotate360 {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.iconfont {
  font-size: 44rpx;
}

.icon-loading {
  animation: rotate360 2s 0.2s linear infinite;
}

.loading-img {
  position: absolute;
  display: block;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  /* background-color: ; */
}
</style>