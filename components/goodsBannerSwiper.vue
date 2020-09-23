<template>
  <!-- 轮播图 -->
  <view class="banner-modules">
    <view class="position-relative" style="padding-bottom: 100%;">
      <view v-if="imgList && imgList.length > 0">
        <swiper
          class="position-absolute imgCover"
          indicator-dots="true"
          indicator-color="#9f9f9f"
          indicator-active-color="#3079ec"
          autoplay="true"
          current="0"
          circular="false"
        >
          <swiper-item
            class="imgCover"
            v-for="(item, index) in imgList"
            :key="index"
            @click="handlePreviewImg(index)"
          >
            <imgWithLoading :src="item"></imgWithLoading>
          </swiper-item>
        </swiper>
      </view>
      <view wx:else class="position-absolute imgCover">
        <imgWithLoading></imgWithLoading>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    imgList: {
      type: Array,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    handlePreviewImg(index) {
      const $imgBaseUrl = uni.$imgBaseUrl;

      const imgList_withHostUrl =
        this.imgList_withHostUrl ||
        (this.imgList_withHostUrl = this.imgList.map(
          (item) => $imgBaseUrl + item
        ));

      console.info('index', index);
      console.info('imgList_withHostUrl', imgList_withHostUrl);

      uni.previewImage({
        current: index,
        urls: imgList_withHostUrl,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>