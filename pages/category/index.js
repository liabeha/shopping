import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList:[],
    // 右侧商品数据
    rightContent:[],
    // 左侧被点击的菜单
    currentIndex:0,
    // 右侧内容滚动离顶部的距离
    scrollTop:0
  },
  // 接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 缓存
      // 保存 wx.setStorageSync("key",value);   取 wx.wx.getStorageSync("key");
      // 1.获取本地存储的数据
    const Cates = wx.getStorageSync("cates");
    if(!Cates){
      // 无数据时发送网络请求获取
      this.getCates();
    }else{
      // 有旧数据时，要先判断是否过期（当前项目是5分钟过期时间）
      if(Date.now() - Cates.time > 1000 * 300) {
        // 重新发送请求
        this.getCates();
      }else{
        this.Cates = Cates.data;    // 将本地数据渲染到页面
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  // 获取分类数据
  async getCates() {
    // request({
    //   url:"/categories"
    // }).then(res => {
    //   this.Cates=res.data.message;

    //   // 把接口数据保存到本地存储中
    //   // 参数是：key，value   （value可以说对象）
    //   wx.setStorageSync("cates",{time:Date.now(), data:this.Cates});

    //   // 构建左侧菜单数据
    //   let leftMenuList = this.Cates.map(v=>v.cat_name);
    //   // 构建右侧商品数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
    
    // 使用es7的 async await 发送请求
    const res = await request({url: "/categories"});   // 请求没回来前不会往下执行
    this.Cates=res;
    // 把接口数据保存到本地存储中
    // 参数是：key，value   （value可以说对象）
    wx.setStorageSync("cates",{time:Date.now(), data:this.Cates});

    // 构建左侧菜单数据
    let leftMenuList = this.Cates.map(v=>v.cat_name);
    // 构建右侧商品数据
    let rightContent=this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e){
    // index是data-index传来的（要加括号）
    const {index} = e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,     // 更新右侧数据
      scrollTop:0      // 重新设置 scroll-view 标签离顶部的距离
    })
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