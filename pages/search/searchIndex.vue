<template>
  <view>
    <headerSearch @headerHeight="setMoudlesNamePostionTop" @search="handleSearch"></headerSearch>
    <!-- 过滤条 -->
    <view>
      <view
        class="position-fixed d-flex filter-bar-modules"
        :style="{top: modulesPostionTop + 'px'}"
      >
        <view class="col-9 d-flex">
          <view
            class="col d-flex align-items-center justify-content-center animated filter-item"
            :class="item.type === getDataCommandObj.sortType ? 'active bounceIn' : ''"
            v-for="item in sortTypeList"
            :key="item.name"
            @click="handleGetDataByNewSortCommand(item)"
          >
            {{item.name}}
            <view
              class="d-flex flex-column icon-updown"
              :class="item.type === getDataCommandObj.sortType && (getDataCommandObj.sortOrder === 1 ? 'down' : 'up')"
              v-if="item.isRenderSortIcon === true"
            ></view>
          </view>
        </view>
        <view
          class="col d-flex align-items-center justify-content-center open-filter-bar-btn"
          @click="handleRenderFilterSideBar"
        >
          <view class="iconfont icon-filter"></view>
          <view>筛选</view>
        </view>
      </view>
      <view style="height: 88rpx"></view>
    </view>
    <!-- 搜索结果 -->
    <listWrapper :dataListObj="dataListObj">
      <goodsList :goodsList="dataListObj.list"></goodsList>
    </listWrapper>
    <!-- 侧边筛选栏 -->
    <filterSideBar ref="filterSideBar" @filterCommand="handleGetDataByCommand"></filterSideBar>
  </view>
</template>

<script>
import headerSearch from "@/components/headerSearch.vue";
import listWrapper from "@/components/global/listWrapper.vue";
import goodsList from "@/components/goodsList.vue";
import filterSideBar from "@/components/filterSideBar.vue";

export default {
  components: {
    headerSearch,
    listWrapper,
    goodsList,
    filterSideBar,
  },
  data() {
    return {
      dataListObj: {
        list: null,
        currentPage: 0,
        lastPage: 0,
      },
      sortTypeList: [
        {
          name: "综合",
          type: 1,
        },
        {
          name: "销量",
          type: 2,
          isRenderSortIcon: true,
        },
        {
          name: "新品",
          type: 3,
          // isRenderSortIcon: true,
        },
        {
          name: "价格",
          type: 4,
          isRenderSortIcon: true,
        },
      ],
      getDataCommandObj: {},
      modulesPostionTop: 0,
    };
  },

  onReachBottom() {
    this.getAndSetDataList({
      isGetNewList: false,
    });
  },

  onLoad(options) {
    const {
      id,
      category_hor,
      category_ver,
      brandID,
      keywords,
      sorttype,
    } = (this.options = options);

    console.info("options", options);

    this.getDataCommandObj = {
      keywords: keywords || "",
      sortType: Number(sorttype) || 1,
      sortOrder: 1,
      categoryID_one: id || category_hor || "",
      categoryID_two: category_ver || "",
      brandID: brandID || "",
    };

    this.getAndSetDataList({
      isGetNewList: true,
    });

    // this.handleRenderFilterSideBar(); //测试，弹出
  },
  methods: {
    async getAndSetDataList({ isGetNewList }, getDataOptions = {}) {
      let dataListObj = this.dataListObj;

      try {
        if (dataListObj.isGettingData === true) {
          console.warn("正在获取数据");
          return false;
        }

        dataListObj.isGettingData = true;

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

        const {
          keywords,
          sortType: sort_type,
          sortOrder: sort_order,
          categoryID_one: category_id1,
          categoryID_two: category_id2,
          brandID: brand_id,
        } = this.getDataCommandObj;

        const { res } = await uni.$ajax({
          apiKey: "getGoodsList",
          data: Object.assign(getDataOptions, {
            page: _currentPage - 1 + 2,
            // paginate: 10,
            keywords, //商品名关键词
            sort_type, //sort_type 排序类型 1综合 2销量 3新品 4价格，默认1
            sort_order, //排序升降序 1降序 2升序，默认1
            category_id1, //category_id1 新分类
            category_id2, //鱼虾分类
            brand_id, //品牌ID
          }),
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
        throw error;
      } finally {
        dataListObj.isGettingData = false;
      }
    },

    //根据新的排序条件获取数据
    async handleGetDataByNewSortCommand(options) {
      let getDataCommandObj = this.getDataCommandObj;
      let { sortType: lastSortType, sortOrder } = getDataCommandObj;

      try {
        let { type: sortType, isRenderSortIcon } = options;

        sortType = Number(sortType);

        if (sortType === lastSortType) {
          if (isRenderSortIcon) {
            sortOrder = sortOrder === 1 ? 2 : 1; //升降序
          } else {
            console.info("重复搜索");
            return false;
          }
        }

        getDataCommandObj.sortType = sortType;
        getDataCommandObj.sortOrder = sortOrder;

        await this.getAndSetDataList({
          isGetNewList: true,
        });
      } catch (error) {
        uni.$catchError(error);

        getDataCommandObj.sortType = lastSortType;
      }
    },

    // 搜索
    async handleSearch(e) {
      try {
        console.info("e", e);

        const keywords = e.value;

        this.getDataCommandObj.keywords = keywords;

        await this.getAndSetDataList({
          isGetNewList: true,
        });
      } catch (error) {
        uni.$toast({
          msg: error,
        });
      }
    },

    //筛选
    handleGetDataByCommand(e) {
      let getDataCommandObj = this.getDataCommandObj;

      const { categoryID_one, categoryID_two, brandID } = e;

      console.info("e", e);

      getDataCommandObj.categoryID_one = categoryID_one;
      getDataCommandObj.categoryID_two = categoryID_two;
      getDataCommandObj.brandID = brandID;

      this.$nextTick(() => {
        this.getAndSetDataList({
          isGetNewList: true,
        });
      });

      this.$refs.filterSideBar.disRender();
    },

    setMoudlesNamePostionTop(modulesPostionTop) {
      this.modulesPostionTop = modulesPostionTop;
    },

    handleRenderFilterSideBar() {
      this.$refs.filterSideBar.render({
        modulesPostionTop: this.modulesPostionTop,
        initFilterCommandObj: this.getDataCommandObj,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* pages/search/searchIndex/searchIndex.wxss */
page {
  background-color: #f5f5f5;
}

.filter-bar-modules {
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #f5f5f5;
  font-size: 13px;
  color: #333;
}

.filter-bar-modules .filter-item {
  line-height: 88rpx;
}
.filter-bar-modules .filter-item.active {
  color: #3079ec;
}

.icon-updown::before,
.icon-updown::after {
  content: "";
  display: block;
  width: 0;
  height: 0;
  border: 7rpx solid transparent;
  border-bottom-color: #999999;
  margin: 2rpx;
}
.icon-updown::after {
  border-bottom-color: transparent;
  border-top-color: #999999;
}

.icon-updown.up::before {
  border-bottom-color: #3079ec;
}
.icon-updown.down::after {
  border-top-color: #3079ec;
}

.open-filter-bar-btn {
  line-height: 88rpx;
  font-size: 13px;
}
</style>