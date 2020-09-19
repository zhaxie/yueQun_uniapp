<template>
  <view
    class="mask MASK"
    v-if="isMounted"
    :animation="animationData"
    @click="handleRemoveMaskByTapMask"
    @touchmove.stop="handleTouchmove"
  >
    <slot></slot>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isMounted: null,
      isHideMask: null,
      animationData: {}
    }
  },
  onReady() {
    this.animation = uni.createAnimation({
      duration: 600,
      timingFunction: "ease",
      delay: 0
    });
  },
  methods: {
    async render(pageQuery) {
      try {
        const lastOpenMaskTimer = this.lastOpenMaskTimer || 0;
        const tapIntervel = new Date().getTime() - lastOpenMaskTimer;

        if (tapIntervel < 800) {
          console.info('频繁点击', '')
          throw null;
        }

        this.lastOpenMaskTimer = new Date().getTime();

        console.info('已打开遮罩');

        this.isMounted = true;

        let _pageQuery = this.pageQuery = pageQuery || {};

        _pageQuery.duration || (_pageQuery.duration = 400);
        _pageQuery.ok && await _pageQuery.ok();

        await wx.nextTick(() => {
          var animation = uni.createAnimation({
            duration: 600,
            timingFunction: "ease",
            delay: 0
          });;

          animation.backgroundColor('rgba(0, 0, 0, 0.8)').opacity(1).step();

          this.animationData = animation.export();
        });

      } catch (error) {
        uni.$catchError(error);
      }
    },

    handleRemoveMaskByTapMask() {
      try {
        const _pageQuery = this.pageQuery;

        if (!_pageQuery.removeByTapMask) throw '不可通过点击关闭遮罩';

        this.removeMask();

      } catch (error) {
        uni.$catchError(error);
        console.log(error);
      }
    },

    removeMask() {
      const lastCloseMaskTimer = this.lastCloseMaskTimer || 0;
      const tapIntervel = new Date().getTime() - lastCloseMaskTimer;

      if (tapIntervel < 500) {
        uni.$toast({
          msg: "频繁点击-关闭"
        });
        return false;
      }

      console.info('已关闭遮罩');

      this.lastCloseMaskTimer = new Date().getTime();

      return new Promise(async (resolve, reject) => {
        try {
          const _pageQuery = this.pageQuery;
          const animation = uni.createAnimation({
            duration: 600,
            timingFunction: "ease",
            delay: 0
          });;

          const removeMaskFn = () => {
            if (this.isMounted === false) {
              return false;
            }

            this.isMounted = false;

            resolve();
          };

          _pageQuery.cancel && await _pageQuery.cancel();

          animation.backgroundColor('rgba(0, 0, 0, 0)').opacity(0).step();

          this.animationData = animation;

          setTimeout(() => {
            removeMaskFn();
          }, 600);

        } catch (error) {
          reject();
          console.log(error);
        }
      });
    },

    handleTouchmove() {
      return false;
    }

  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  opacity: 0;
}
</style>