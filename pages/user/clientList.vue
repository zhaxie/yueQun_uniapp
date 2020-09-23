<template>
  <view>
    <headerSearch
      :initOptions="initOptions_searchHeader"
      @headerHeight="setMoudlesNamePostionTop"
      @search="handleSearch"
    ></headerSearch>
    <listWrapper :dataListObj="dataListObj">
      <view
        class="position-sticky z100 py-20 select-tips-title"
        :style="{top: modulesPostionTop}"
      >请选择切换的公司</view>
      <view class="content-list">
        <view
          class="my-20 px-20 o-hidden content-item"
          v-for="(item) in dataListObj.list"
          :key="item.client_id"
          @click="handleBindNewClientInfo(item)"
        >
          <view class="d-flex align-items-center my-30">
            <view class="col-10 text-over-one title">{{item.name}}</view>
            <view
              class="ml-auto animated bounceIn status-text"
              v-if="currentClientID === item.client_id"
            >已选择</view>
          </view>
          <view class="pb-30 center-list">
            <view class="d-flex my-5 list-item">
              <view class="flex-shrink-0">联系方式：</view>
              <view class="text-over-two">{{item.phone || '暂无'}}</view>
            </view>
            <view class="d-flex my-5 list-item">
              <view class="flex-shrink-0">联系地址：</view>
              <view class="text-over-two">{{item.address || '暂无'}}</view>
            </view>
            <view class="d-flex my-5 list-item">
              <view class="flex-shrink-0">所属分组：</view>
              <view class="text-over-two">{{item.grouping || '暂无'}}</view>
            </view>
          </view>
        </view>
      </view>
    </listWrapper>
  </view>
</template>

<script>
import headerSearch from "@/components/headerSearch.vue";
import listWrapper from "@/components/global/listWrapper.vue";

export default {
  components: {
    headerSearch,
    listWrapper,
  },
  data() {
    return {
      dataListObj: {},
      noticeTipsObj: {
        isRender: false,
      },
      initOptions_searchHeader: {
        placeholder: "请输入客户名称",
      },
    };
  },

  onLoad() {
    this.init();
  },

  onPullDownRefresh() {
    this.init();
  },

  onReachBottom: function () {
    this.getAndSetDataList({
      isGetNewList: false,
      keyword: this.keyword,
    });
  },

  methods: {
    async init() {
      this.getAndSetDataList({
        isGetNewList: true,
      });
    },

    async getAndSetCurrentClientID() {
      console.info("绑定客户资质", "");
      try {
        const currentClientID = this.currentClientID;

        if (!currentClientID) {
          const { res } = await uni.$ajax({
            apiKey: "getUserInfo",
          });

          this.currentClientID = res.client_id;
        }
      } catch (error) {
        uni.$catchError(error);
      }
    },

    async getAndSetDataList({ isGetNewList, keyword }) {
      try {
        const dataListObj = this.dataListObj;

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

        const { res } = await uni.$ajax({
          apiKey: "getUserClientList",
          data: {
            page: _currentPage - 1 + 2,
            // paginate: 3,
            name: keyword || "",
          },
        });

        const {
          current_page: currentPage,
          last_page: lastPage,
          data: list,
        } = res;

        const existedList = dataListObj.list || [];

        this.dataListObj = {
          list: isGetNewList === true ? list : existedList.concat(list),
          currentPage: Number(currentPage) || 1,
          lastPage: Number(lastPage) || 1,
        };

        // this.getAndSetCurrentClientID();
      } catch (error) {
        uni.$catchError(error);
      } finally {
        uni.stopPullDownRefresh();
      }
    },

    handleSearch(e) {
      console.info('e', e);
      const keyword = e.value;

      console.info("e", e);
      console.info("keyword", keyword);

      this.getAndSetDataList({
        isGetNewList: true,
        keyword,
      });
    },

    //选择客户信息
    async handleBindNewClientInfo(thisClientInfo) {
      try {
        if (this.isSubmitted_bindClientInfo === true) return false;

        const { client_id: clientID } = thisClientInfo;

        this.isSubmitted_bindClientInfo = true;

        await uni.$ajax({
          apiKey: "bindUserClient",
          data: {
            client_id: clientID,
          },
        });

        this.currentClientID = clientID;

        uni.$bus.emit("changeClientInfo", thisClientInfo);

      } catch (error) {
        delete this.isSubmitted_bindClientInfo;
        uni.$catchError(error);
      }
    },

    openToWin(e) {
      console.info("e", e);

      const dataset = e.currentTarget.dataset;

      const name = dataset.pagename;
      const id = dataset.id;

      console.info("name", name);
      uni.$router.push({
        name,
        query: {
          id,
        },
      });
    },

    setMoudlesNamePostionTop(e) {
      console.info("e", e);

      this.modulesPostionTop = e.detail;
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
.select-tips-title {
  left: 0;
  padding-left: 46rpx;
  background-color: #f5f5f5;
  font-size: 14px;
  color: #000;
}

.content-list .content-item {
  margin-left: 24rpx;
  margin-right: 24rpx;
  background-color: #fff;
  border-radius: 10rpx;
}

.content-list .content-item .title {
  font-size: 16px;
  font-weight: bold;
  color: #000000;
}

.content-list .content-item .status-text {
  font-size: 13px;
  color: #3079ec;
}

.content-list .content-item .center-list .list-item {
  font-size: 14px;
  color: #999999;
}
</style>
