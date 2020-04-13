// 页面同时发送的异步代码的次数
let ajaxTimes = 0;

export const request = (params) => {
    // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
    let header = {
        ...params.header
    };
    if (params.url.includes("/my/")) {
        // 拼接header 带上token
        header["Authorization"] = wx.getStorageSync("token");
    }

    ajaxTimes++; // ajaxTimes记录请求的次数

    // 显示加载中的动画
    wx.showLoading({
        title: "加载中",
        mask: true, // 透明蒙层，防止触摸穿透
    });

    // 定义公共url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({

            // url:https://api-hmugo-web.itheima.net/api/public/v1/index
            ...params, // 相当于把参数直接放到这里
            url: baseUrl + params.url,

            success: (result) => {
                resolve(result.data.message);
            },
            fail: (err) => {
                reject(err);
            },

            complete: () => { // 无论成功还是失败都会执行
                ajaxTimes--; // 请求全部回来前，不能关闭加载中的动画
                if (ajaxTimes === 0) {
                    wx.hideLoading(); // 关闭加载中的动画
                }
            }
        });
    })
}