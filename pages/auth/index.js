// pages/auth/index.js
Page({

  data: {
    cart: [],
    totalPrice: 0
  },
  // 获取用户信息
  // handleGetUserInfo(e) {
  //   const {encryptedData, iv, rawData, signature} = e.detail;
  //   // 获取登录成功后的code
  //   wx.login({
  //     timeout:10000,
  //     success: (result)=>{
  //       const {code} = result;
  //     },
  //     fail: ()=>{},
  //     complete: ()=>{}
  //   });
  // }
  onShow() {
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[];
    const index = cart.findIndex(v=>v.checked);
    const totalPrice = cart[index].goods_price * cart[index].num;

    this.setData({    // 更新数据
      cart,
      totalPrice
    })
    wx.setStorageSync("cart", cart);   // key, value
  },

  button_money() {
    //let {cart} = this.data;
    //var index = cart.findIndex(v=>v.checked);
    wx.showModal({
      title: '提示',
      content: '确定支付吗？',
      success: (res)=> {
        if (res.confirm) {
          //this.cart[this.index].order = 1;    // 1是支付成功
          //wx.setStorageSync("cart", cart);
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1500,
            mask: false,
          });
        } else if (res.cancel) {
          //this.cart[this.index].order = 2;   // 2是待支付
          //wx.setStorageSync("cart", cart);
          wx.showToast({
            title: '付款取消中',
            icon: 'loading',
            duration: 1000,
            mask: false,
          });
        }
      }
    }) 
  },
})