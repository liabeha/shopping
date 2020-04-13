import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({

  data: {
    goods:[],
    goodsousuo: [],
    inputValue: '',
    ycang: false
  },
  TimeId: -1,   // 防抖

  // 输入框值一改变就会触发
  handleInput(e) {
    // 获取输入框的值
    const {value} = e.detail;
    this.setData({
      inputValue: value
    })
    // 检测合法性（判空）
    if(!value.trim()){    // trim去掉两边的空格
      // 值为空字符串
      this.setData({
        inputValue: "",
        ycang: false,
        goods:[],
      })
      return;
    }  
    // 发送请求
    clearTimeout(this.TimeId);    // 清除定时器
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },

  storages(res) {
    const goodsousuo = wx.getStorageSync("goodsousuo")||[];
    wx.setStorageSync("goodsousuo", res);
  },

  // 发送请求获取数据
  async qsearch(query) {
    const res = await request({url:"/goods/search", data:{query}});
    this.setData({
      goods: res
    })
    this.storages(res);
  },

  wangchenchufa(){
    wx.navigateTo({
      url: '/pages/sea/index'
    });
  },

  textbind() {
    this.setData({
      inputValue: '',
      ycang: false,
      goods:[],
    })
  },

  // sousuo() {
  //   wx.navigateTo({
  //     url: '/pages/sea/index'
  //   });
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})