// 引入发送请求的方法（在小程序里路径要写完整）
import { request } from "../../request/index.js"


Page({
  data: {   // 与vue一样，data里的数据是响应式的
    // 轮播图数组
    swiperList:[],
    // 导航数组
    catesList:[],
    // 楼层数据
    floorList:[]
  },
  // 页面一开始加载时触发的生命周期事件
  onLoad: function(options) {
    // 1.发送网络请求（获取轮播图数据）
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   // header: {'content-type':'application/json'},    // 四个都是有默认值的，可省略
    //   // method: 'GET',
    //   // dataType: 'json',
    //   // responseType: 'text',
    //   success: (result) => {
    //     this.setData({
    //       // setData 用于将数据从逻辑层发送到视图层（异步）
    //       swiperList:result.data.message
    //     })
    //   },
    //   fail: () => {},
    //   // complete 成功或失败都会调用的回调函数
    //   complete: () => {}
    // });
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  // 获取轮播图数据
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result=>{   // .then请求成功触发（success调用后触发）
      this.setData({
        swiperList:result
      })
    })
  },
  // 获取分类导航数据
  getCateList(){
    request({url:"/home/catitems"})
    .then(result=>{   // .then请求成功触发（success调用后触发）
      this.setData({
        catesList:result
      })
    })
  },
  // 获取楼层数据
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result=>{   // .then请求成功触发（success调用后触发）
      this.setData({
        floorList:result
      })
    })
  },

  onReady: function() {
    
  },
  onShow: function() {
    
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item) {

  }
});
  