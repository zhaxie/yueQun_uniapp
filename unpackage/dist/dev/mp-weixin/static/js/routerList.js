export default {
    home: {
        path: "pages/tabPages/home",
        meta: {
            pageTitle: '越群轻松订',
            pageTitleAlign: 'left',
            pageTitleMarginSize: '30rpx',
            bgColor: '#3079ec',
            color: '#fff',
            disRenderBackBtn: true,
        }
    },
    classification: {
        path: "pages/tabPages/classification",
        meta: {
            pageTitle: '分类',
            bgColor: '#ffffff',
            disRenderBackBtn: true,
        }
    },
    shopCart: {
        path: "pages/tabPages/shopCart",
        meta: {
            pageTitle: '购物车',
            bgColor: '#ffffff',
            headerBottomDividingLine: 'border-bottom: 1px solid #eaeaea',
            disRenderBackBtn: true,
        }
    },
    userCenter: {
        path: "pages/tabPages/userCenter",
        meta: {
            pageTitle: '',
            bgColor: '#3079ec',
            disRenderBackBtn: true,
        }
    },
    clientList: {
        path: "pages/user/clientList",
        meta: {
            pageTitle: '客户列表',
            bgColor: '#f5f5f5',
            disRenderBackBtn: true,
        }
    },
    clientDetails: {
        path: "pages/user/clientDetails",
        meta: {
            pageTitle: '我的资料',
            bgColor: '#fff',
        }
    },
    goodsDetails: {
        path: "pages/goods/goodsDetails",
        meta: {
            pageTitle: '商品详情',
            bgColor: '#ffffff',
            headerBottomDividingLine: 'border-bottom: 1px solid #eaeaea',
        }
    },
    searchInput: {
        path: "pages/search/searchInput",
        meta: {
            pageTitle: '搜索',
            bgColor: '#fff',
        }
    },
    searchIndex: {
        path: "pages/search/searchIndex", //搜索结果
        meta: {
            pageTitle: '',
            bgColor: '#f5f5f5',
        }
    },
    orderList: {
        path: "pages/order/orderList",
        meta: {
            pageTitle: '我的订单',
            bgColor: '#fff',
            headerBottomDividingLine: 'border-bottom: 1px solid #eaeaea',
        }
    },
    orderDetails: {
        path: "pages/order/orderDetails",
        meta: {
            pageTitle: '订单详情',
            bgColor: '#fff',
            headerBottomDividingLine: 'border-bottom: 1px solid #eaeaea',
        }
    },
    login: {
        path: "pages/user/login",
        meta: {
            pageTitle: '',
            entryBeforeUserPermise: {
                title: '请先登录',
                content: '我们需要获取您的登录信息，用于读取订单等功能',
            },
        }
    },
    unableUseAppTips: {
        path: "pages/other/unableUseAppTips",
        meta: {
            entryBeforeUserPermise: {
                title: '客户资质未绑定',
                content: '您的客户资质尚未绑定，请联系管理员',
            },
        }
    },
}