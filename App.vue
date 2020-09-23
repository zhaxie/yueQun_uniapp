<script>
import Common from "@/static/js/common.js";
import Http from "@/static/js/ajax.js";
import Bus from "@/static/js/bus.js";
import Router from "@/static/js/router.js";

export default {
  onLaunch: function () {
    console.log("App Launch");

    const http = new Http();
    const common = new Common();

    uni.$com = common;
    uni.$toast = common.showToast;
    uni.$router = new Router();
    uni.$ajax = http.ajax.bind(http);
    uni.$imgBaseUrl = "https://yuequn.ozkoalas.cn";
    uni.$bus = new Bus();
    uni.$checkTapTooFaster = common.checkTapTooFaster; //频繁点击
    uni.$catchError = common.catchError; //捕获错误
  },
  async onShow(options) {
    //获取app的启动参数，比如分享的key等等
    const openAppQuery = uni.openAppQuery = await this.getOpenAppQuery(options);

    //获取我的分享key
    // uni.$com.getAndSaveMyShareKey(openAppQuery);
  },
  methods: {
    //获取app的启动参数，比如分享的key等等
    getOpenAppQuery(options) {
      let url = options.path;
      let pageParam = {};
      let urlLink = '';

      if (/\?/.test(url)) {
        let urlSplit = url.split('?');
        let urlQueryArr = urlSplit[1].split('&');

        urlLink = urlSplit[0];

        urlQueryArr.forEach((item) => {
          let auery = item.split("=");

          pageParam[auery[0]] = auery[1];
        });

      } else {
        urlLink = url;
      }

      return Object.assign(options.query, pageParam);
    },

  }
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
  font-family: uniicons;
  src: url("/static/uni.ttf");
}
/* #endif */
</style>
