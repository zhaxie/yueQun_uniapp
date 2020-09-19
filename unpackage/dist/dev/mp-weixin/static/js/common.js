class Common {
  showToast({ msg, icon, duration, isShowMask }) {
    console.info('1212', 1212);
    
    if (msg === null) return false;
    if (msg === undefined) { msg = '存在未定义的值' };

    if (typeof msg !== 'string') {
      console.error('有错误', msg);
      msg = JSON.stringify(msg)
    };

    wx.showToast({
      title: msg,
      icon: icon || 'none',
      duration: duration || 2500,
      mask: isShowMask || false,
      fail: (error) => {
        console.error('showToast', error);
      },
    });
  };

  confirm(options = {}) {
    return new Promise((resolve, reject) => {
      const {
        title,
        content,
        showCancel,
        cancelText,
        cancelColor,
        confirmText,
        confirmColor
      } = options;

      wx.showModal({
        title: title || '是否确定',
        content: content || '',
        showCancel: showCancel !== undefined ? showCancel : true,
        cancelText: cancelText || '取消',
        cancelColor: cancelColor || '#000000',
        confirmText: confirmText || '确定',
        confirmColor: confirmColor || '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            resolve(true);
          }
        },
        fail: (error) => {

          console.error('error', error);
          reject(error)
        },
      });

    })
  }

  //去登录
  toLogin() {
    wx.navigateTo({
      url: '/pages/user/login/login',
      fail: (error) => {
        console.error('error', error);
      }
    });
  };
  router() {
    return class Router {
      constructor() {
        const routerList = require('./routerList.js').default;

        this.routerList = routerList;
        this.currentRouterInfo = null;

        this.routerResolveList = [];
      }

      push({ name: toRouterName, getUserPermise, query }) {

        if (this[toRouterName] === true) {
          console.error('正在打开目标页面');
          return false;
        }

        this[toRouterName] = true;

        console.info('toRouterName', toRouterName);

        return new Promise(async (resolve, reject) => {
          try {
            const currentRouterInfo = this.routerList[toRouterName];
            let { path, meta } = currentRouterInfo;

            if (!toRouterName) throw '路由名字有误';
            if (!path) throw '路由地址有误';

            if (meta && getUserPermise) {
              try {
                await this.checkByMetaBeforePushRouter(meta);
              } catch (error) {
                delete this[toRouterName];

                reject(null);
                return false;
              }
            }

            this.currentRouterInfo = currentRouterInfo;

            //参数转化----开始
            let queryToString = '';

            for (let key in query) {
              const item = query[key];

              queryToString += ('&' + key + '=' + item);
            }

            queryToString = queryToString.replace('&', '?');

            //参数转化----结束
            path = '/' + path + queryToString;

            wx.navigateTo({
              url: path,
              fail: error => {
                wx.switchTab({
                  url: path,
                  fail: (err) => {
                    reject(error);
                  },
                  success: () => {
                    this.addNewResolveWhenRouterPush(resolve); //记录当前的resolve, 用于$router.back();
                  }
                });
              },
              success: () => {
                this.addNewResolveWhenRouterPush(resolve); //记录当前的resolve, 用于$router.back();
              },
              complete: () => {
                delete this[toRouterName];
              }
            });

          } catch (error) {
            console.error('error', error);

            delete this[toRouterName];
            reject(error);
          }
        });
      };

      replace({ name }) {
        return new Promise((resolve, reject) => {
          const currentRouterInfo = this.routerList[name];
          const { path } = currentRouterInfo;

          wx.redirectTo({
            url: '/' + path,
            success: () => {
              resolve();
            },
            fail: (error) => {
              reject(error);
            }
          });
        });
      };

      //页面栈后退
      back(backLength, backObj) {

        return new Promise((resolve, reject) => {

          console.error('后退wewewe', '')
          if (this.isBacking === true) {
            console.error('正在后退关闭页面');
            return false;
          }

          this.isBacking = true;
          const currentPageLen = getCurrentPages().length;

          if (currentPageLen > 1 && backLength !== 'home') {
            const deltaLen = Math.abs(backLength);

            wx.navigateBack({
              delta: deltaLen,
              success: () => {
                resolve();
                this.resolveAndRemoveWhenRouterBack(deltaLen, backObj);
              },
              fail: (error) => {
                console.error('error', error);
                reject(error);
              },
              complete: () => {
                this.isBacking = false;
              }
            });
          } else {
            wx.switchTab({
              url: '/' + this.routerList['home'].path,
              success: () => {
                resolve();
                this.resolveAndRemoveWhenRouterBack(this.routerResolveList.length, backObj);
              },
              fail: (error) => {
                console.info('error', error);
                reject(error);
              },
              complete: () => {
                this.isBacking = false;
              }
            });
          }
        })
      }; 1

      //打开新的路由之后就把旧的resolve记录起来
      addNewResolveWhenRouterPush(newResolve) {
        this.routerResolveList.push(newResolve);

        console.info('push----routerResolveList', this.routerResolveList);
      };

      //关闭页面栈时，释放并移除前面加进来的resolve, 
      resolveAndRemoveWhenRouterBack(backLen, backObj) {
        let routerResolveList = this.routerResolveList;
        let sholudResolveList = routerResolveList.splice(-1, backLen); //从倒数第一位开始，把后面的数据截取掉

        console.info('back----backLen', backLen);
        console.info('back----sholudResolveList', sholudResolveList);
        console.info('back----routerResolveList', routerResolveList);

        sholudResolveList.forEach(item => item(backObj));
      };

      //打开新页面前，拦截处理
      checkByMetaBeforePushRouter(meta) {
        try {
          const { title, content } = meta.entryBeforeUserPermise;

          return new Promise((resolve, reject) => {
            wx.showModal({
              title,
              content,
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#000000',
              confirmText: '确定',
              confirmColor: '#3CC51F',
              success: (result) => {
                if (result.confirm) {
                  resolve(true);
                } else {
                  reject(false);
                }
              },
              fail: (err) => {
                reject(err);
              },
            });

          });
        } catch (error) {
          console.error('error', error);
          throw error;
        }
      };

      //释放开启的promise
      resolveRouter() {
        const _resolve = this.resolve;

        _resolve && _resolve();
      }

    }

  };

  getDomRect({ _this, dom }) {
    return new Promise((resolve) => {
      const domQuery = wx.createSelectorQuery().in(_this);
      const _pageRect = domQuery.select(dom).boundingClientRect();

      console.info('_pageRect', _pageRect)

      _pageRect.exec((res) => {
        console.info('res', res);
        resolve(res[0]);
      });
    });
  };

  checkValueByRules(inputList) {
    let valueObj = {};

    inputList.forEach(item => {
      const {
        id,
        value: inputValue,
        emptyValueTips,
        mapKey,
        rules,
      } = item;

      if (emptyValueTips && (!inputValue || !inputValue.trim())) {
        valueObj = null;
        throw emptyValueTips || '输入不能为空';
      };

      if (rules) {
        rules.forEach(ruleItem => {
          const checkRuleRet = ruleItem(inputValue);

          if (typeof checkRuleRet === 'string') {
            valueObj = null;
            throw checkRuleRet;
          }
        });
      }

      valueObj[mapKey] = id || inputValue || '';
    });

    return valueObj;
  };


  onShareAppMessage() {
    let myInfo = wx.getStorageSync('userInfo');
    let _routerList = wx.$router.routerList;
    let path;

    if (myInfo === null) {
      path = _routerList.home.path;
    } else {
      path = _routerList.friendManor.path + '?userID=' + myInfo.user_id + '&isEntryByShare=true';
    };

    console.info('path', path);

    return {
      title: '快来我的番茄王国吧~',
      path,
    };
  };

  //频繁点击限制
  checkTapTooFaster(timeInterval = 200) {
    const lastTapNavTime = this.lastTapNavTime || 0;
    let checkRet;

    if (new Date().getTime() - lastTapNavTime < (timeInterval)) {
      wx.$toast({
        msg: '',
      });
      checkRet = true;
    } else {
      checkRet = false;
    }

    this.lastTapNavTime = new Date().getTime();
    return checkRet;
  };

  catchError(error) {
    console.error('出错了：', error);
    console.error('出错了：', new Error());

    uni.$toast({
      msg: error,
    });

  };

  // 时间差：日时分秒
  diffTime(startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    var diff = endDate.getTime() - startDate.getTime();//时间差的毫秒数 

    //计算出相差天数 
    var days = Math.floor(diff / (24 * 3600 * 1000));

    //计算出小时数 
    var leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数 
    var hours = Math.floor(leave1 / (3600 * 1000));

    //计算相差分钟数 
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数 
    var minutes = Math.floor(leave2 / (60 * 1000));

    //计算相差秒数 
    var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数 
    var seconds = Math.round(leave3 / 1000);

    return {
      days,
      hours,
      minutes,
      seconds
    };
  }

  //获取我的分享key
  async getAndSaveMyShareKey(openAppQuery) {
    try {
      const { returnData } = await uni.$ajax({
        apiKey: 'getMyShareKey',
        data: {
          inComeShareKey: openAppQuery.parSharekey || '',
        },
      });

      openAppQuery.myShareKey = returnData;

    } catch (error) {
      uni.$catchError(error);
    }
  };

}

export default Common;