class Common {
  showToast({ msg, icon, duration, isShowMask }) {
    console.info('1212', 1212);

    if (msg === null) return false;
    if (msg === undefined) { msg = '存在未定义的值' };

    if (typeof msg !== 'string') {
      console.error('有错误', msg);
      msg = JSON.stringify(msg)
    };

    uni.showToast({
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

      uni.showModal({
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
    uni.navigateTo({
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

      async push(fullPath) {
        try {
          let {
            name: toRouterName,
            queryToStr,
            queryToObj
          } = this.getRouterOptions(fullPath);

          if (this[toRouterName] === true) {
            console.error('正在打开目标页面');
            return false;
          }

          this[toRouterName] = true;

          const currentRouterInfo = this.routerList[toRouterName];

          let { path, meta } = currentRouterInfo;

          if (!toRouterName) throw '路由名字有误';
          if (!path) throw '路由地址有误';

          if (meta && queryToObj.getUserPermise) {
            try {
              await this.checkByMetaBeforePushRouter(meta);
            } catch (error) {
              delete this[toRouterName];

              return false;
            }
          }

          this.currentRouterInfo = currentRouterInfo;

          const finalPath = '/' + path + queryToStr;

          await new Promise((resolve, reject) => {
            uni.navigateTo({
              url: finalPath,
              fail: error => {
                uni.switchTab({
                  url: finalPath,
                  fail: (err) => {
                    reject(error);
                  },
                  success: () => {
                    resolve();
                  }
                });
              },
              success: () => {
              },
              complete: () => {
                delete this[toRouterName];
              }
            });
          });

        } catch (error) {
          console.error('error', error);

          delete this[toRouterName];
          reject(error);
        }
      };

      replace({ name }) {
        return new Promise((resolve, reject) => {
          const currentRouterInfo = this.routerList[name];
          const { path } = currentRouterInfo;

          uni.redirectTo({
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

          if (this.isBacking === true) {
            console.error('正在后退关闭页面');
            return false;
          }

          this.isBacking = true;
          const currentPageLen = getCurrentPages().length;

          if (currentPageLen > 1 && backLength !== 'home') {
            const deltaLen = Math.abs(backLength);

            uni.navigateBack({
              delta: deltaLen,
              success: () => {
                resolve();
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
            uni.switchTab({
              url: '/' + this.routerList['home'].path,
              success: () => {
                resolve();
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
      };

      //打开新页面前，拦截处理
      checkByMetaBeforePushRouter(meta) {
        try {
          const { title, content } = meta.entryBeforeUserPermise;

          return new Promise((resolve, reject) => {
            uni.showModal({
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

      //获取路由参数
      getRouterOptions(fullPath) {
        let routerOpt;

        switch (typeof fullPath) {
          case 'string':
            routerOpt = this.getPageNameAndQueryByUrl(fullPath);
            break;
          case 'object':
            console.info('routerOpt', fullPath);
            routerOpt = fullPath;
            routerOpt.queryToStr = this.transQueryToStr(fullPath.query);
            routerOpt.queryToObj = fullPath.query;
            break;
        }

        if(!routerOpt.queryToObj){
          routerOpt.queryToObj = {};
        }

        console.info('routerOpt', routerOpt);

        return routerOpt;
      };

      //通过Url, 获取页面名称和参数
      getPageNameAndQueryByUrl(url) {
        let pathNameAndQuery = url.split("?");

        let pathName = pathNameAndQuery[0];
        let queryToStr = pathNameAndQuery[1] || '';
        let queryToObj = {};

        if (queryToStr) {
          let queryToList = queryToStr.split("&");

          queryToList.forEach((item) => {
            const keyValue = item.split("=");

            queryToObj[keyValue[0]] = keyValue[1];
          });

          queryToStr = '?' + queryToStr;

          console.info("queryToObj", queryToObj);
        }

        // console.info("pathNameAndQuery", pathNameAndQuery);
        // console.info("pathName", pathName);
        // console.info("queryToStr", queryToStr);

        return {
          name: pathName,
          queryToObj,
          queryToStr,
        }
      };

      //参数转化为string
      transQueryToStr(query) {
        let queryToStr = '';

        if (typeof query === 'object') {
          for (let key in query) {
            const item = query[key];

            queryToStr += ('&' + key + '=' + item);
          }

          queryToStr = queryToStr.replace('&', '?');
        }

        return queryToStr;
      };
    }
  };

  getDomRect({ _this, dom }) {
    return new Promise((resolve) => {
      const domQuery = uni.createSelectorQuery().in(_this);
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
    let myInfo = uni.getStorageSync('userInfo');
    let _routerList = uni.$router.routerList;
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
      uni.$toast({
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

  //获取并绑定用户信息
  getAndBindUserClient() {
    return new Promise(async (resolve, reject) => {
      try {
        const { res } = await uni.$ajax({
          apiKey: 'getUserClientList',
        });

        const clientList = res.data;
        const clientListLen = clientList.length;

        console.info('去绑定客户信息', '')

        //有客户信息，就弹出actionSheet选择后, 并绑定客户信息
        if (clientListLen > 0) {

          await uni.$com.confirm({
            title: '请先绑定客户信息',
            content: '服务需要，请先选择并绑定客户信息',
            showCancel: false,
          });

          uni.$router.push({
            name: 'clientList',
          });

          //监听，更改客户信息
          uni.$bus.on('changeClientInfo', async () => {
            await uni.$router.back(-1); //特殊操作：用于关闭绑定

            uni.$bus.off('changeClientInfo');
            resolve(true);
          });

        } else {
          // 没有客户信息, 直接返回

          console.info('没有客户信息', '')
          resolve(true);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

}

export default Common;