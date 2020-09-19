// 发布订阅：

// 使用手册：

// ----app.js:

// import Bus from '/utils/bus.js';
// wx.$bus = new Bus();


// -----页面使用：

//监听：

// wx.$bus.on('name', (options) => {
//     console.info('options', options);
// });


// 触发：

// wx.$bus.emit('name', (options) => {
//     console.info('options', options);
// });


//移除：

// wx.$bus.off('name');


export default class Bus {
    constructor() {
        this.busList = [];
    };

    on(messName, cb) {
        this.busList.push({
            name: messName,
            cb
        });
    };

    off(messName) {
        let _busList = this.busList;

        _busList.forEach(item => {
            if (item.name === messName) {
                item.isRemove = true;
            }
        });

        this.busList = _busList.filter(item => item.isRemove !== true);
    };

    emit(messName, data) {
        this.busList.forEach(item => {
            if (item.name === messName) {
                item.cb(data);
            }
        });
    };
}

