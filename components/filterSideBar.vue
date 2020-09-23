<template>
  <mask ref="mask">
    <view
      class="position-fixed z100 d-flex flex-column animated faster filter-side-bar"
      :class="isRemoveAchievement ? 'slideOutRight' : 'slideInRight'"
      @click.stop=""
    >
      <view :style="{height: modulesPostionTop + 'px'}"></view>
      <view class="col" style="border-top: 1px solid #ddd;" v-if="commandList">
        <scroll-view scroll-y="true" style="height: 100%">
          <view class="command-moudles" v-for="(item, index) in commandList" :key="index">
            <view class="position-sticky z100 px-40 mb-30 title">{{item.title}}</view>
            <view class="d-flex flex-wrap px-40 mb-30 command-list">
              <view
                class="px-30 mr-20 mb-20 animated comand-item"
                :class="item.selectedID === itemList.id && 'active bounceIn'"
                v-for="itemList in item.list"
                :key="itemList.title"
                @click="handleSelectedThisCategory(itemList, item)"
              >{{itemList.title}}</view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="d-flex align-items-center py-20 pl-20 pr-10 footer-btns">
        <view class="col mr-20 btn" @click="handleActionFilter(0)">重置</view>
        <view class="col mr-20 btn active" @click="handleActionFilter(1)">筛选</view>
      </view>
    </view>
  </mask>
</template>

<script>
export default {
  data() {
    return {
      isRemoveAchievement: null,
      commandList: null,
      modulesPostionTop: null,
    };
  },
  methods: {
    async getFilterList(initFilterCommandObj) {
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

        const newResList = resList.map((item, index) => {
          return {
            title: ["分类一", "分类二", "品牌"][index],
            type: ["categoryID_one", "categoryID_two", "brandID"][index],
            list: item.res.map((item) => {
              return {
                title: item.name,
                id: item.category_id || item.brand_id,
              };
            }),
          };
        });

        newResList.forEach((item) => {
          item.selectedID = Number(initFilterCommandObj[item.type]) || ""; //自动添加已选择的过滤条件
        });

        console.info("newResList", newResList);

        return newResList;
      } catch (error) {
        uni.$toast({
          msg: error,
        });
      }
    },

    handleSelectedThisCategory(thisCategory, thisCategoryBelongComand) {
      console.info("thisCategory", thisCategory);
      console.info("thisCategoryBelongComand", thisCategoryBelongComand);

      let currentSelectedID = thisCategory.id;
      let lastSelectedID = thisCategoryBelongComand.selectedID;

      currentSelectedID =
        lastSelectedID === currentSelectedID && currentSelectedID
          ? ""
          : currentSelectedID;

      thisCategoryBelongComand.selectedID = currentSelectedID;
    },

    handleActionFilter(type) {
      const commandList = this.commandList;

      switch (
        Number(type) //0：重置 1：筛选
      ) {
        case 0:
          commandList.forEach((item) => (item.selectedID = null));
          break;
        case 1:
          const filterCommandIDObj = {};

          commandList.forEach((item) => {
            filterCommandIDObj[item.type] = item.selectedID || "";
          });

          console.info("filterCommandIDObj", filterCommandIDObj);

          this.$emit("filterCommand", filterCommandIDObj);
          break;
      }
    },
    async render(initOptions) {
      try {
        await uni.$com.checkTapTooFaster();

        const { modulesPostionTop, initFilterCommandObj } = initOptions;

        this.modulesPostionTop = modulesPostionTop;

        if (!this.commandList) {
          this.commandList = await this.getFilterList(initFilterCommandObj);
        }

        this.$refs.mask.render({
          removeByTapMask: true,
          ok: () => {
            this.isRemoveAchievement = false;
          },
          cancel: () => {
            this.isRemoveAchievement = true;
          },
        });
      } catch (error) {
        uni.$toast({
          msg: error,
        });
      }
    },
    disRender() {
      this.$refs.mask.removeMask();
    },
    //特殊操作，阻止点击冒泡导致关闭遮罩
  },
};
</script>

<style lang="scss" scoped>
.filter-side-bar {
  right: 0;
  top: 0;
  bottom: 0;
  left: 4rem;
  background-color: #fff;
}

.footer-btns {
  border-top: 1px solid #ddd;
}

.footer-btns .btn {
  font-size: 14px;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 78rpx;
  line-height: 78rpx;
  text-align: center;
}

.footer-btns .btn.active {
  border: 1px solid #3079ec;
  background-color: #3079ec;
  color: #fff;
}

.command-moudles .title {
  top: 0;
  left: 0;
  line-height: 68rpx;
  font-size: 13px;
  color: #333;
  background-color: #fff;
}
.command-moudles .command-list {
  margin-right: -20rpx;
}
.command-moudles .command-list .comand-item {
  border: 1px solid #f4f4f4;
  background-color: #f4f4f4;
  border-radius: 34rpx;
  line-height: 68rpx;
  font-size: 14px;
  text-align: center;
  color: #333;
}

.command-moudles .command-list .comand-item.active {
  background-color: #fff;
  border-color: #3079ec;
  color: #3079ec;
}
</style>