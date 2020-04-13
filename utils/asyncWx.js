// 简化获取用户权限
export const getSetting=()=>{
    return new Promise((resolve, reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {}
        });
    })
}

// 简化获取用户收货地址
export const chooseAddress=()=>{
    return new Promise((resolve, reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {}
        });
    })
}

// 用户之前拒绝过授予权限，要诱导用户打开授权页面
export const openSetting=()=>{
    return new Promise((resolve, reject)=>{
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {}
        });
    })
}

// 商品数量为1时，点击-号是否要删除商品
export const showModal=({content})=>{     // content提示内容
    return new Promise((resolve, reject)=>{
        wx.showModal({
            title: '提示',
            content: content,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            },
          })
    })
}

// 结算的
export const showToast=({title})=>{     // content提示内容
    return new Promise((resolve, reject)=>{
        wx.showToast({
            title: title,
            icon: 'none',
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            },
          })
    })
}