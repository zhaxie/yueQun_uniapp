<template>
  <view>
    <!-- 标题栏 -->
    <navBar></navBar>

    <!-- 主区域 -->
    <mainContainer>
      <view class="login-modules">
        <view class="mx-auto mt-40 my-30 icon-logo">
          <imgWithLoading :withoutDomainName="true" src="/static/icon/icon-logo.png"></imgWithLoading>
        </view>
        <view class="text-center big-title">越群轻松订登录</view>
        <view class="mt-40 mb-20 tips-title">越群轻松订小程序登录将使用：</view>
        <view class="get-info-list">
          <view class="d-flex align-items-center mb-20 get-info-item">你的公开信息（昵称、头像、地区及性别等）</view>
        </view>
        <button class="com-big-btn" open-type="getUserInfo" @getuserinfo="triggerlogin">登录</button>
      </view>

      <bindMobileDialog ref="bindMobileDialog"></bindMobileDialog>
    </mainContainer>
  </view>
</template>

<script>
import bindMobileDialog from "@/components/bindMobileDialog.vue";

export default {
  components: {
    bindMobileDialog,
  },
  methods: {
    //触发登录
    async triggerlogin() {
      try {
        await uni.$checkTapTooFaster();

        if (this.isSubmitLogin === true) return false;
        this.isSubmitLogin = true;

        const ret_getUserInfo = await this.getUserInfoByWx(); //获取微信用户信息
        const ret_doWxLogin = await this.doWxLogin(); //微信登录
        const { msg, res: loginRet } = await this.loginByAjax(
          ret_doWxLogin,
          ret_getUserInfo
        ); //接口登录

        await this.saveMyLoginInfo(loginRet); //保存我的登录信息

        const isBindMobile = await this.isBindMobileByAjax(); //是否绑定了手机号

        //没有绑定手机
        if (!isBindMobile) {
          this.isSubmitLogin = false;

          if (this.isBindedMobile !== true) {
            this.isBindedMobile = await new Promise((resolve) => {
              this.$refs.bindMobileDialog.render({
                success: resolve,
              });
            });
          }

          await uni.$com.getAndBindUserClient(); //绑定用户的客户(类似于多角色，选个角色)
        }

        console.info("ret_getUserInfo", ret_getUserInfo);
        console.info("ret_doWxLogin", ret_doWxLogin);
        console.info("loginRet", loginRet);

        await this.loginSuccess(loginRet);

        uni.$toast({
          msg,
        });
      } catch (error) {
        if (error && error.errMsg === "getUserInfo:fail:auth deny") {
          //用户点击取消微信授权按钮
          return false;
        }

        delete this.isSubmitLogin;
        uni.$catchError(error);

      }
    },

    //保存我的登录信息
    saveMyLoginInfo(loginRet) {
      uni.setStorageSync("userInfo", loginRet);
      uni.setStorageSync("token_outTime", new Date().getTime());
      uni.setStorageSync("token", loginRet.token);
    },

    //验证是否绑定了手机号
    async isBindMobileByAjax() {
      const { res } = await uni.$ajax({
        apiKey: "bindMobile",
        data: {
          check_bind: 1, //验证是否绑定手机号码 1是
        },
      });

      return !!(res && res.status);
    },

    //获取用户信息
    getUserInfoByWx() {
      return new Promise((resolve, reject) => {
        uni.getUserInfo({
          withCredentials: "true",
          lang: "zh_CN",
          timeout: 10000,
          success: (result) => {
            resolve(result.userInfo);
          },
          fail: (err) => {
            console.error("err", err);

            if (err.err_code == -12006 || /-12006/.test(err.errMsg)) {
              //用户不同意授权
              err = "服务需要，请同意授权";
            }
            reject(err);
          },
        });
      });
    },

    //微信登录
    doWxLogin() {
      return new Promise((resolve, reject) => {
        uni.login({
          success: (result) => {
            resolve(result);
          },
          fail: (error) => reject(error),
        });
      });
    },

    //接口登录
    async loginByAjax(ret_doWxLogin, ret_getUserInfo) {
      const { code: js_code } = ret_doWxLogin;
      const {
        avatarUrl: avatar,
        nickName: nickname,
        gender,
        country,
        province,
        city,
      } = ret_getUserInfo;

      return await uni.$ajax({
        apiKey: "login",
        data: {
          js_code, //  js_code js授权码
          nickname, //  nickname 😎 微信昵称
          avatar, //  avatar 头像
          gender, //  gender 性别 0保密 1男 2女
          country, //  country 国家
          province, //  province 省份
          city, //  city 城市
        },
      });
    },

    async loginSuccess(res) {
      // await uni.setStorageSync('userInfo', res);
      // await uni.setStorageSync('token_outTime', new Date().getTime());
      // await new Promise(resolve => setTimeout(() => resolve()), 0);
      // await uni.setStorageSync('token', res.token);
      // await new Promise(resolve => setTimeout(() => resolve()), 0);

      //初始化来源页
      const pages = await getCurrentPages();
      const lastPage = pages[pages.length - 2];

      if (lastPage) {
        pages
          .slice(0, pages.length - 1)
          .forEach((item) => item.onLoad(item.options || ""));

        await uni.$router.back(-1); //后退一页
      } else {
        // await uni.$router.back('userCenter'); //v1，只返回到个人中心
        uni.$router.back("home"); //v2版本
      }

      uni.$bus.emit("loginSuccess");
    },
  },
};
</script>

<style lang="scss" scoped>
.login-modules {
  padding-left: 66rpx;
  padding-right: 66rpx;
}

.login-modules .icon-logo {
  width: 150rpx;
  height: 150rpx;
}
.login-modules .big-title {
  padding-bottom: 50rpx;
  border-bottom: 1px solid #cccccc;
  font-weight: bold;
  font-size: 16px;
  color: #333;
}
.login-modules .tips-title {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.login-modules .get-info-list {
  margin-bottom: 80rpx;
}
.login-modules .get-info-list .get-info-item::before {
  margin-right: 26rpx;
  content: "";
  display: block;
  width: 10rpx;
  height: 10rpx;
  background-color: #bbbbbb;
  border-radius: 50%;
}
.login-modules .get-info-list .get-info-item {
  font-size: 14px;
  color: #606060;
}
</style>