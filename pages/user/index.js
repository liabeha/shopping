// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},     // 用户的数据都在缓存里面
    collectNums: 0    // 被收藏的商品数量
  },

  onShow() {
    const userinfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync("collect")||[];
    this.setData({userinfo, collectNums:collect.length});    // collect.length只显示收藏商品的总数量
  }
})