<template>
  <view :style="{height: navOpt.height}">
    <view
      class="position-fixed z400 header-modules HEADERDOM"
      :style="{background: pageOpt.bgColor, opacity: initOptions && initOptions.opacity !== undefined ? initOptions.opacity : 1}"
    >
      <view
        class="position-relative main-content"
        :style="{
          marginTop: navOpt.top, 
          textAlign: pageOpt.pageTitleAlign, 
          paddingLeft: pageOpt.pageTitleMarginSize, 
          color: pageOpt.pageTitleColor,
        }"
      >
        <view
          class="position-absolute d-flex align-items-center left-btn-content"
          v-if="!pageOpt.disRenderBackBtn === true"
        >
          <view
            class="iconfont mr-20 icon-btn"
            @click="handleRouterBack()"
          >
            <image class="imgCover" src="/static/icon/com_back.png" />
          </view>
          <view class="iconfont icon-btn">
            <slot></slot>
          </view>
        </view>
        {{pageOpt.pageTitle !== null ? pageOpt.pageTitle : '页头'}}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    initOptions: {
      //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      default: () => {
        return {
          isTabPage: false,
        };
      },
    },
  },
  data() {
    return {
      navOpt: {},
      pageOpt: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      try {
        //注意：使用微信开发者工具切换手机调试，需要清除清除掉缓存，不然高度会直接提取缓存中的信息
        const { header_top, header_height } =
          (await uni.$com.headerInfo) ||
          (await uni.getStorageSync("headerInfo")) ||
          (await this.getHeaderBySystermInfo());

        await this.setPageTitleByCurrentRouterInfo();

        console.info("header_top", header_top);
        console.info("header_height", header_height);

        const headerTotallHeight = header_top - 1 + 1 + header_height;

        this.navOpt = {
          top: header_top + "px",
          height: headerTotallHeight + "px",
        };

        this.$emit("headerHeight", headerTotallHeight);
      } catch (error) {
        console.error("error", error);

        uni.$toast({
          msh: error,
        });
      }
    },
    async setPageTitleByCurrentRouterInfo() {
      let initOptions = this.initOptions || {};
      let { isTabPage } = initOptions;

      if (isTabPage === true) {
        return false;
      }

      const currentRouterInfo = await this.getCurrentRouterInfo();
      const {
        pageTitle,
        bgColor,
        pageTitleAlign,
        pageTitleMarginSize,
        color,
        headerBottomDividingLine,
        disRenderBackBtn,
      } = currentRouterInfo.meta;

      this.pageOpt = {
        pageTitle: initOptions.title || pageTitle,
        bgColor: bgColor || "#fff",
        pageTitleAlign: pageTitleAlign || "center", //标题对齐方式
        pageTitleMarginSize: pageTitleMarginSize || 0, //标题的距离边界
        pageTitleColor: color || "#000", //标题颜色
        headerBottomDividingLine: headerBottomDividingLine || null, //nav底部的分界线
        disRenderBackBtn: disRenderBackBtn || false,
      };
    },

    async getCurrentRouterInfo() {
      const $router = uni.$router;
      let currentRouterInfo = $router.currentRouterInfo;

      const currentPage = await getCurrentPages();

      const routerList = $router.routerList;
      const currentRouter = currentPage[currentPage.length - 1].route;

      console.info("currentPage", currentPage);
      console.info("currentRouter", currentRouter);

      for (let key in routerList) {
        const item = routerList[key];

        if (item.path === currentRouter) {
          currentRouterInfo = item;
          break;
        }
      }

      console.info("currentRouterInfo", currentRouterInfo);

      return currentRouterInfo;
    },

    getHeaderBySystermInfo() {
      return new Promise((resolve) => {
        let menuButton =
          uni.getMenuButtonBoundingClientRect &&
          uni.getMenuButtonBoundingClientRect();

        const domQuery = uni.createSelectorQuery().in(this);
        const boundingClientRect = domQuery
          .select(".HEADERDOM")
          .boundingClientRect();

        boundingClientRect.exec((res) => {
          const header_height = res[0].height;
          let menuBtn_height;
          let menuBtn_top;
          let header_top;

          if (menuButton) {
            menuBtn_height = menuButton.height;
            menuBtn_top = menuButton.top;

            header_top = menuBtn_top - (header_height - menuBtn_height) / 2;
          } else {
            header_top = 0;
          }

          console.info("header_height", header_height);
          console.info("menuBtn_height", menuBtn_height);
          console.info("header_top", header_top);

          const headerInfo = {
            header_height,
            header_top,
          };

          uni.$com.headerInfo = headerInfo;
          uni.setStorageSync("headerInfo", headerInfo);

          resolve(headerInfo);
        });
      });
    },
    handleRouterBack() {
      console.info("1212");
      uni.$router.back(-1);
    },
  },
};
</script>

<style >
.header-modules {
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
}
.header-modules .main-content {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  font-size: 18px;
}

.header-modules .main-content .left-btn-content {
  left: 12rpx;
  top: 0;
  bottom: 0;
  margin-top: auto;
  margin-bottom: auto;
}

.header-modules .main-content .left-btn-content .icon-btn {
  border: 10rpx solid transparent;
}
</style>