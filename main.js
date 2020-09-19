import Vue from 'vue'
import App from './App'

//共用css
import '@/static/css/xx-base.css';
import '@/static/css/animate.css';
import '@/static/css/iconfont.css';

//页面路由
import '@/static/js/routerList.js';

//全局组件
// import navBar from '@/components/global/navBar.vue'; //顶部标题导航
// import mainContainer from '@/components/global/mainContainer.vue'; //主区域
// import imgWithLoading from '@/components/global/imgWithLoading.vue'; //图片
// import mask from '@/components/global/mask.vue'; //遮罩
// import uniCountdown from '@/components/uni-countdown/uni-countdown.vue'; //倒计时

// Vue.component('navBar', navBar);
// Vue.component('mainContainer', mainContainer);
// Vue.component('imgWithLoading', imgWithLoading);
// Vue.component('mask', mask);
// Vue.component('uniCountdown', uniCountdown);

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
	...App
})
app.$mount();
