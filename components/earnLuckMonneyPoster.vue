<template>
  <mask class="MASK" ref="mask">
    <view class="position-fixed center-poster" @click.stop="">
      <view class="animated bounceIn poster-box">
        <!-- 分享图 -->
        <view class="position-relative poster-img">
          <imgWithLoading
            class="position-absolute imgCover"
            :src="sharePoster.posterUrl"
          ></imgWithLoading>
        </view>
        <!-- 分享按钮 -->
        <view class="d-flex justify-content-around share-btn-list">
          <button
            class="share-btn"
            open-type="share"
            @click="handleCloseDialog"
          >
            <view class="btn-icon">
              <imgWithLoading
                class="m-auto imgCover"
                :src="require('@/static/icon/share_weChat.png')"
              ></imgWithLoading>
            </view>
            <view class="text-center btn-text">微信好友</view>
          </button>
          <view
            class="share-btn"
            @click="handleDownLoadImg(sharePoster.posterUrl)"
          >
            <view class="btn-icon">
              <imgWithLoading
                class="m-auto imgCover"
                :src="require('@/static/icon/share_download.png')"
              ></imgWithLoading>
            </view>
            <view class="text-center btn-text">下载图片</view>
          </view>
        </view>
      </view>
    </view>
  </mask>
</template>

<script>
export default {
  data() {
    return {
      sharePoster: {
        posterUrl: ''
      }
    }
  },
  methods: {
    async render() {
      try {
        if (this.isSubmitted_getPoster === true) {
          return false;
        }

        let openAppQuery = uni.openAppQuery;
        let myShareKey = openAppQuery.myShareKey;

        this.isSubmitted_getPoster = true;

        if (!myShareKey) {
          myShareKey = await uni.$com.getAndSaveMyShareKey(openAppQuery); //获取我的分享key
        }

        const { returnData } = await uni.$ajax({
          apiKey: 'getUserQrCodePosterImage',
          data: {
            type: 0,
            sharekey: myShareKey
          }
        });

        this.sharePoster.posterUrl = returnData; //分享图

        //打开弹窗
        this.$refs.mask.render({
          removeByTapMask: true,
          cancel: () => {
            this.isSubmitted_getPoster = false;
          }
        });

      } catch (error) {
        this.isSubmitted_getPoster = false;
        uni.$catchError(error);
      }
    },

    // 下载分享图
    handleDownLoadImg(sharePosterUrl) {
      try {
        if (this.isDownloading === true) {
          uni.$toast({
            msg: '下载中，请稍候',
          });
          return false;
        }

        uni.getSetting({
          success: (res) => {
            console.log('', res);
            if (res.authSetting["scope.writePhotosAlbum"] == false) {
              uni.showModal({
                title: '提示',
                content: '请允许小程序下载图片',
                showCancel: true,
                cancelText: '取消',
                cancelColor: '#000000',
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: (res2) => {
                  if (res2.confirm) {
                    uni.openSetting();
                  }
                },
              });
            } else {
              uni.showModal({
                title: '提示',
                content: '是否下载本图片',
                showCancel: true,
                cancelText: '取消',
                cancelColor: '#000000',
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: async (result) => {
                  if (result.confirm) {

                    try {
                      uni.showLoading({
                        title: "下载中",
                        mask: true,
                      });

                      this.isDownloading === true;

                      await this.downloadFile(sharePosterUrl);

                      uni.hideLoading();

                      this.isDownloading === false;
                      this.handleCloseDialog(); //关闭弹窗

                      uni.$toast({
                        msg: '下载成功，已保存到相册',
                      });

                    } catch (error) {
                      uni.$catchError(error);
                    }
                    
                  }
                },
              });
            }
          },
        });
      } catch (error) {
        uni.$catchError(error);
      }
    },

    //下载文件
    downloadFile(sharePosterUrl) {
      return new Promise((resolve, reject) => {

        uni.downloadFile({
          url: sharePosterUrl,
          success: function (res) {

            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                resolve(res);
              },
              fail: function (err) {
                reject(err);
              }
            });

          },
          fail: function (err) {
            reject(err);
          }
        });

      });
    },

    //关闭弹窗
    handleCloseDialog() {
      this.$refs.mask.removeMask();
    },
  },
}
</script>

<style lang="scss" scoped>
.center-poster {
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);

  .poster-box {
    width: 64vw;
    border-radius: 10rpx;

    .poster-img {
      padding-bottom: 176%;
      background-color: #fff;
    }
  }
}

//分享按钮栏
.share-btn-list {
  margin-top: 26rpx;

  .btn-icon {
    width: 86rpx;
    height: 86rpx;
    border-radius: 50%;
    overflow: hidden;
  }

  .btn-text {
    margin-top: 16rpx;
    font-size: 24rpx;
    color: #fff;
  }
}
</style>