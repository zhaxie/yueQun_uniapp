<template>
  <view class="position-relative imgCover">
    <!-- 加载中 -->
    <view class="loading-img iconfont icon-loading" v-if="isLoadingImg"></view>
    <!-- 加载失败 -->
    <view class="loading-img iconfont icon-load-fail" v-if="imgLoadError"></view>
    <!-- 加载成功 -->
    <image
      class="imgCover animated img-box"
      :class="isLoadedSucess && 'active'"
      :src="imgUrl"
      :mode="mode || 'aspectFill'"
      :lazy-load="false"
      @load="handleLoadImgSuccess"
      @error="handleLoadImgError"
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
    withoutDomainName: {
      type: Boolean,
    },
    width: {
      type: String,
    },
  },
  data() {
    return {
      isLoadingImg: true,
      imgLoadError: false,
      isLoadedSucess: null,
    };
  },
  methods: {
    handleLoadImgSuccess(e) {
      this.isLoadingImg = false;
      this.imgLoadError = false;

      this.isLoadedSucess = true;
    },
    handleLoadImgError(e) {
      console.error("图片加载失败", e);

      this.isLoadingImg = false;
      this.imgLoadError = true;
    },
  },
  computed: {
    imgUrl() {
      const src = this.src;
      const withoutDomainName = this.withoutDomainName;
      const imgBaseUrl = uni.$imgBaseUrl;

      console.info("src", src);

      if (!withoutDomainName) {
        return imgBaseUrl + src;
      } else {
        return src;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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

.img-box {
  opacity: 0;
  transition: all 0.4s;

  &.active {
    opacity: 1;
  }
}
</style>