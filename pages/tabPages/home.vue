<template>
  <view>
    <!-- 标题栏 -->
    <navBar @headerHeight="setMoudlesNamePostionTop"></navBar>

    <!-- 主区域 -->
    <mainContainer>
      <!-- 轮播图 -->
      <view class="ma-30 banner-modules">
        <view class="position-relative" style="padding-bottom: 49.42%;">
          <swiper
            class="position-absolute imgCover"
            :indicator-dots="true"
            :indicator-color="'#9f9f9f'"
            :indicator-active-color="'#3079ec'"
            :autoplay="true"
            :current="0"
            :interval="5000"
            :duration="1000"
            :circular="false"
          >
            <swiper-item class="imgCover" v-for="(item, index) in 1" :key="index">
              <imgWithLoading :withoutDomainName="true" src="/static/img/test-banner-1.png"></imgWithLoading>
            </swiper-item>
          </swiper>
        </view>
      </view>

      <!-- 分类入口 -->
      <view class="d-flex flex-wrap py-20 classification-entry-modules">
        <view
          class="col-3"
          v-for="item in classificationList"
          :key="item.name"
          @click="handleOpenToWin(`searchIndex?id=${item.category_id}&scence=indexCategory`)"
        >
          <view class="ma-auto class-icon">
            <imgWithLoading :src="item.pic_small"></imgWithLoading>
          </view>
          <view class="mt-5 mb-20 text-center class-title">{{item.name}}</view>
        </view>
      </view>

      <!-- 热销产品 -->
      <view class="hot-sale-modules">
        <!-- 模块名字 -->
        <view
          class="position-sticky z100 d-flex align-items-center pa-30 modules-name-bar"
          :style="{top: (modulesPostionTop || 0) + 'px'}"
          @click="handleOpenToWin(`searchIndex?sorttype=2&scence=hotSale`)"
        >
          <view class="col label">热销产品</view>
          <view class="look-more-btn">更多</view>
        </view>
        <!-- 商品列表 -->
        <goodsList :goodsList="hotSaleGoodsList"></goodsList>
      </view>
    </mainContainer>
  </view>
</template>

<script>
import goodsList from "@/components/goodsList.vue";

export default {
  components: {
    goodsList,
  },
  data() {
    return {
      classificationList: [
        {
          name: "淡水鱼料",
          pic_small: "/static/icon/home_class_1.png",
        },
        {
          name: "观赏鱼料",
          pic_small: "/static/icon/home_class_2.png",
        },
        {
          name: "海水鱼料",
          pic_small: "/static/icon/home_class_3.png",
        },
        {
          name: "虾料",
          pic_small: "/static/icon/home_class_4.png",
        },
      ],
      modulesPostionTop: null,
      hotSaleGoodsList: [],
    };
  },

  onShareAppMessage() {
    return {};
  },

  onLoad(options) {
    this.init();
  },

  methods: {
    init() {
      this.getAndSetCategoryList(); //分类
      this.getAndSetHotSaleGoodsList(); //热销商品
    },

    //获取分类
    async getAndSetCategoryList() {
      try {
        const { res } = await uni.$ajax({
          apiKey: "getGoodsCategory",
          data: {
            type: 1, //分类类型 1新分类 2鱼虾分类
          },
        });

        console.info("res", res);

        this.classificationList = res;
      } catch (error) {
        uni.$catchError(error);
      }
    },

    //获取热销商品
    async getAndSetHotSaleGoodsList() {
      try {
        let { res } = await uni.$ajax({
          apiKey: "getGoodsList",
          data: {
            sort_type: 2, //sort_type 排序类型 1综合 2销量 3新品 4价格，默认1
            sort_order: 1, //sort_order 排序升降序 1降序 2升序，默认1
            paginate: 10, //只取前10条数据
          },
        });

        this.hotSaleGoodsList = res.data;
      } catch (error) {
        uni.$catchError(error);
      }
    },

    setMoudlesNamePostionTop(e) {
      console.info("setMoudlesNamePostionTop", e);

      this.modulesPostionTop = e;
    },

    onDevelopingTips() {
      uni.$com.onDevelopingTips();
    },

    handleOpenToWin(fullPath) {
      uni.$router.push(fullPath);
    },
  },
};
</script>

<style>
page {
  background-color: #f5f5f5;
}
</style>

<style lang="scss" scoped>
/* 轮播图 */
.banner-modules {
  border-radius: 14rpx;
  overflow: hidden;
}

/* 分类入口 */
.classification-entry-modules .class-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  overflow: hidden;
}
.classification-entry-modules .class-title {
  font-size: 12px;
  color: #000;
}

/* 模块名字 */
.modules-name-bar {
  background-color: #f5f5f5;
}
.modules-name-bar .label {
  font-weight: bold;
  font-size: 15px;
  color: #333333;
}
.modules-name-bar .look-more-btn {
  font-size: 12px;
  color: #333333;
}
</style>