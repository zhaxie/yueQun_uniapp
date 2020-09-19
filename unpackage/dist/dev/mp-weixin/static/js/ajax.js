
export default class Http {
  constructor() {
    this.apiKeyObj = {};
    this.apiObj = require('./api.js').default;
  };

  //请求参数转换
  transformRequest(data) {
    let ret = '';
    let _encodeURIComponent = encodeURIComponent;

    for (let key in data) {
      const item = data[key];

      if (item.__proto__.constructor === Array) {
        for (let index = 0, len = item.length; index < len; index++) {
          ret += _encodeURIComponent(key + '[]') + '=' + _encodeURIComponent(item[index]) + '&';
        }
      } else {
        ret += _encodeURIComponent(key) + '=' + _encodeURIComponent(item) + '&';
      }
    }
    return ret;
  };

  //微信请求papi
  wxRequest(options, api) {
    return new Promise(async (resolve, reject) => {
      const {
        method,
        data
      } = options;

      this.lastRequestApi = api;
      this.lastRequestData = data;

      console.info('api', api);

      uni.request({
        // url: 'https://zzltest.stntian.com' + api, //拼他
        url: 'https://csjl.stntian.com/' + api, //潮汕节料
        // url: 'https://zzl.stntian.com/' + api, //
        header: {
          // "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": uni.getStorageSync("token") || "",
        },
        method: method || 'GET',
        responseType: '',
        // transformRequest: [this.transformRequest],
        dataType: 'json',
        data: data || {},
        success: (respon = {}) => {
          resolve(respon);
        },
        fail: (error) => {
          reject(error)
        },
        complete: () => {
          delete this.lastRequestApi;
          delete this.lastRequestData;
        }
      });
    });
  };

  wxUploadFile(options, api) {
    return new Promise((resolve, reject) => {
      const {
        filePath
      } = options;

      uni.uploadFile({
        url: 'https://yuequn.ozkoalas.cn' + api,
        filePath,
        name: 'image',
        header: {
          "Authorization": options.token,
        },
        formData: {},
        success: (respon = {}) => {
          resolve(respon);
        },
        fail: (error) => {
          reject(error);
        },
      });
    });
  };


  //请求成功
  requestSuccess(requestRet) {
    const { isSuccess, msg, res } = requestRet;

    console.info('isSuccess', isSuccess);
    console.info('requestRet', requestRet);

    switch (isSuccess) { // -1 错误数据  -90001: 要登录 -90002: 没有客户资质
      case 1:
        return true;
      case -1:
        throw msg;
    }
  }

  //登录
  doLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: async (result) => {
          // console.info('result', result);
          try {
            const { returnData } = await this.ajax({
              apiKey: 'doLogin',
              method: 'POST',
              isLoginAjax: true,
              data: {
                code: result.code
              },
            });

            uni.setStorageSync('token', returnData.token);
            uni.setStorageSync('userInfo', returnData);

            resolve(ret);

          } catch (error) {
            uni.$catchError(error);
            reject(error);
          }
        },
        fail: (error) => {
          reject(error);
        }
      });
    })
  };

  showLoading() {
    clearTimeout(this.showLoadingTimer);
    this.showLoadingTimer = setTimeout(() => {
      uni.showLoading();
      this.showLodding = true;
    }, 150);
  }

  hideLoading() {
    clearTimeout(this.showLoadingTimer);

    if (this.showLodding === true) {
      uni.hideLoading();
      this.showLodding = false;
    }
  }

  ajax(options = {}) {
    return new Promise(async (resolve, reject) => {
      const { apiKey, isUploadFile } = options;

      try {
        const api = this.apiObj[apiKey];
        const token = uni.getStorageSync("token") || '';

        if (!api) throw '请求地址有误';

        if (!token) {
          if (this.isDoingLogin !== true) {
            this.isDoingLogin = true;

            console.info('去登录222 ')
            await this.doLogin();

            this.isDoingLogin = false;
            options.isLoginAjax = true;
          }

          if (!options.isLoginAjax === true) {
            return false;
          }
        }

        this.showLoading();
        options.token = token;

        //请求开始
        const {
          statusCode,
          data
        } = !isUploadFile ? await this.wxRequest(options, api) : await this.wxUploadFile(options, api);

        console.info('---请求返回结果---：', data)

        switch (statusCode) {
          case 200:
            await this.requestSuccess(data);
            resolve(data);
            break;
          case 500:
            throw '网络欠佳';
          default:
            throw '网络请求出错，未知错误';
        }

      } catch (error) {
        //请求完毕：处理错误
        console.error('ajax出错详情：', error);

        if (error && /request:fail/.test(error.errMsg)) {
          error = "请求失败，请检查网络"
        }

        reject(error);
      } finally {
        this.hideLoading();
      }
    });
  };
}