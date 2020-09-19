export default {
  getHomeBannerList: 'api/home/GetHomeAdv',       //首页轮播
  getLowGroupList: 'api/group/GetTodayHotGroup',  //首页团购
  getGroupList: 'api/Group/List',                 //获取产品列表

  //用戶
  getUserInfo: 'api/User/UserCenter',             //获取用户信息
  getCash: 'api/User/AddCashOrder',               //提现
  doLogin: 'api/User/Login',                      //登录
  getUserUnreadQty: 'api/User/GetUserUnreadQty',  //获取未读数量
  updateUserInfo: 'api/User/UpdateUserInfo',      //更新用户信息
  getMyShareKey: 'api/User/GetShareKey',          //获取我的分享key
  getUserQrCodePosterImage: 'api/Share/GetUserQrCodePosterImage', //获取我的分享广告图

  // 商品
  getGroupByID: 'api/Group/GetGroupByID', //获取商品详情
}
