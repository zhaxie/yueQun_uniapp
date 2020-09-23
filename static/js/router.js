export default class Router {
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

        if (!routerOpt.queryToObj) {
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
        }

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
};