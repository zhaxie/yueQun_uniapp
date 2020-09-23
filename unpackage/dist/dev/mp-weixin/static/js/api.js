export default {

  //用户相关
  login: '/api.php/user/login',                               //POST 微信登录
  bindMobile: '/api.php/user/bind_mobile',                    //POST 绑定手机号
  getUserInfo: '/api.php/user/user_info',                     //POST 获取用户信息
  getUserClientList: '/api.php/user/client_list',             //POST 获取用户的客户列表
  bindUserClient: '/api.php/user/bind_client',                //POST 绑定客户信息

  //订单
  getOrderList: '/api.php/order/order_list',                  //POST 获取订单列表
  getOrderDetailsByID: '/api.php/order/info',                 //POST 获取订单详情

  //商品
  getGoodsCategory: '/api.php/category/index',                //获取分类
  getBrandList: '/api.php/brand/index',                       //获取品牌列表
  getGoodsList: '/api.php/goods/index',                       //获取商品列表
  getGoodsDetailsByID: '/api.php/goods/info',                 //获取商品详情
}