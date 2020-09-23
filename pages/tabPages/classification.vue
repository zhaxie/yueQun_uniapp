<template>
  <view class="d-flex flex-column" style="height: 100vh">
    <navBar></navBar>
    <view class="col">
      <view class="d-flex flex-column h-100">
        <!-- 搜索 -->
        <view class="d-flex align-items-center ma-30 search-modules">
          <view class="mx-10 iconfont icon-search">
            <imgWithLoading
              :withoutDomainName="true"
              src="/static/icon/class_search.png"
              class="imgCover"
            ></imgWithLoading>
          </view>
          <view class="col h-100 input-search">
            <input
              class="h-100 input"
              type="text"
              placeholder="搜索产品"
              placeholder-class="input-placeholder"
              maxlength="20"
              @confirm="handleSearch"
            />
          </view>
        </view>
        <!-- 分类：横排 -->
        <view class="class-horizontal">
          <scroll-view class="h-100" scroll-x="true">
            <view class="d-flex">
              <view
                class="col-3 text-center hor-item animated"
                :class="item.category_id === searchCommandObj.category_hor && 'active bounceIn'"
                v-for="item in classHorizontalList"
                :key="item.name"
                @click="handleAddSearchCommand('hor', item.category_id)"
              >{{item.name}}</view>
            </view>
          </scroll-view>
        </view>
        <view class="col">
          <view class="d-flex h-100">
            <!-- 分类: 垂直 -->
            <view class="class-vertical">
              <scroll-view class="h-100" scroll-y="true">
                <view
                  class="px-30 text-over-one vertical-item animated"
                  :class="item.category_id === searchCommandObj.category_ver  && 'active bounceIn'"
                  v-for="item in classVerticalList"
                  :key="item.name"
                  @click="handleAddSearchCommand('ver', item.category_id)"
                >{{item.name}}</view>
              </scroll-view>
            </view>
            <!-- 主要内容区域 -->
            <view class="col px-30 main-content">
              <scroll-view class="h-100" scroll-y="true">
                <view>
                  <view class="position-sticky z100 py-30 title">品牌</view>
                  <view class="d-flex flex-wrap brand-list">
                    <view
                      class="col-6"
                      v-for="item in brandList"
                      :key="item.name"
                      @click="handleAddSearchCommand('brand', item.brand_id)"
                    >
                      <view
                        class="mr-15 mb-15 brand-item animated"
                        :class="item.brand_id === searchCommandObj.brandID && 'active bounceIn'"
                      >{{item.name}}</view>
                    </view>
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      searchCommandObj: {
        category_hor: "",
        category_ver: "",
        brandID: "",
      },
      classHorizontalList: [],
      classVerticalList: [],
      brandList: [],
    };
  },
  onLoad(options) {
    this.init();
  },
  methods: {
    async init() {
      try {
        const resList = await Promise.all([
          uni.$ajax({
            apiKey: "getGoodsCategory",
            data: {
              type: 1, //分类类型 1新分类 2鱼虾分类
            },
          }),
          uni.$ajax({
            apiKey: "getGoodsCategory",
            data: {
              type: 2, //分类类型 1新分类 2鱼虾分类
            },
          }),
          uni.$ajax({
            apiKey: "getBrandList", //获取品牌列表
          }),
        ]);

        console.info("resList", resList);

        this.classHorizontalList = resList[0].res;
        this.classVerticalList = resList[1].res;
        this.brandList = resList[2].res;

      } catch (error) {
        uni.$catchError(error);
      }
    },

    //添加搜索条件
    handleAddSearchCommand(type, id) {
      try {
        const searchCommandObj = this.searchCommandObj;

        let isSelectedAllCommand = true;

        console.info('type', type);
        console.info('id', id);

        switch (
          type //分类： hor: 水平;  ver: 垂直; brand: 品牌
        ) {
          case "hor":

            searchCommandObj.category_hor = id;
            searchCommandObj.category_ver = null;
            searchCommandObj.brandID = null;

            break;
          case "ver":

            searchCommandObj.category_ver = id;
            searchCommandObj.brandID = null;

            break;
          case "brand":
            if (
              !searchCommandObj.category_hor ||
              !searchCommandObj.category_ver
            ) {
              throw "请先选择其他分类";
            }

            searchCommandObj.brandID = id;

            for (let key in searchCommandObj) {
              if (!searchCommandObj[key]) {
                isSelectedAllCommand = false;
                break;
              }
            }

            searchCommandObj.scence = "classification";

            if (isSelectedAllCommand === true) {
              uni.$router.push({
                name: "searchIndex",
                query: searchCommandObj,
              });
            }
            break;
        }
      } catch (error) {
        uni.$catchError(error);
      }
    },

    handleSearch(e) {
      try {
        const keywords = e.detail.value;

        console.info("keywords", keywords);

        if (!keywords) throw "非法输入";

        uni.$router.push({
          name: "searchIndex",
          query: {
            keywords,
            scence: "classification_searchBar",
          },
        });
      } catch (error) {
        uni.$catchError(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* 搜索 */
.search-modules {
  height: 52rpx;
  border-radius: 26rpx;
  background-color: #f5f5f5;
  overflow: hidden;
}
.search-modules .input-search .input {
  font-size: 13px;
  color: #666;
}
.search-modules .input-search .input-placeholder {
  font-size: 13px;
  color: #999999;
}

/* 分类：横排 */
.class-horizontal {
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
}
.class-horizontal .hor-item {
  font-size: 14px;
  line-height: 92rpx;
}
.class-horizontal .hor-item.active {
  color: #3079ec;
}
.class-horizontal .hor-item.active::after {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  margin: auto;
  content: "";
  display: block;
  width: 55rpx;
  height: 2px;
  background-color: #3079ec;
}

/* 分类: 垂直 */
.class-vertical {
  min-width: 190rpx;
  max-width: 250rpx;
  background-color: #f5f5f5;
}
.class-vertical .vertical-item {
  padding-top: 34rpx;
  padding-bottom: 34rpx;
  font-size: 14px;
  color: #000000;
}
.class-vertical .vertical-item.active {
  position: relative;
  background-color: #fff;
  color: #3079ec;
}
.class-vertical .vertical-item.active::before {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  content: "";
  display: block;
  width: 2px;
  height: 52rpx;
  background-color: #3079ec;
}

/* 主要内容区域 */
.main-content .title {
  left: 0;
  top: 0;
  font-size: 12px;
  color: #000000;
  background-color: #fff;
}
.main-content .brand-list {
  margin-right: -15rpx;
}
.main-content .brand-list .brand-item {
  line-height: 66rpx;
  background-color: #f5f5f5;
  border-radius: 33rpx;
  text-align: center;
  font-size: 14px;
  color: #000000;
}

.main-content .brand-list .brand-item.active {
  color: #3079ec;
}
</style>