import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({
  data: {
    goodsousuo: []
  },
  onShow() {
    // 获取缓存的数据
    const goodsousuo = wx.getStorageSync("goodsousuo")||[];
    
    this.setData({
      goodsousuo
    })
  }
})