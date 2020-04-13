import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },

  // 接口数据
  QueryParams:{
    query: "",       // 商品名字（用于搜索）
    cid: "",         // 商品的id
    pagenum: 1,      // 当前页码
    pagesize: 10     // 每页请求多少数据
  },
  // 总页数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 其它页面传过来的参数都在options里面
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query = options.query||"";
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({url: "/goods/search", data: this.QueryParams});

    // 获取总条数
    const total = res.total;
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize);
    this.setData({
      // goodsList:res.goods    // goodsList是空数组，记录获取到的商品数据
      goodsList: [...this.data.goodsList, ...res.goods]   // 拼接数组，要做上滑加载，不能直接赋值
    })

    // 关闭下拉加载的等待的动画效果
    wx.stopPullDownRefresh();
  },

  // 子组件的点击事件（tabs）
  bandleTabsItemChange(e) {
    // 获取被点击的索引（index是子组件传递过来的）
    const {index} = e.detail;
    // 修改原数组
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);   // v是值，i是索引
    // 赋值到data
    this.setData({
      tabs
    })
  },

  /*
  用户滚动页面到底部，加载下一页数据
    1.触发滚动条触底事件
    2.判断是否存在下一页的数据
      (1)获取总页数，总页数 = MAth.ceil(总条数 / 页容量) = MAth.ceil(total / pagesize)  
                            = 23 / 10 = 3 MAth.ceil向上取整
      (2)获取当前页数，pagenum
      (3)判断 当前页数 >= 总页数 （没有数据了）
    3.若没有，弹出提示
    4.若有，加载数据
      (1)页数++
      (2)重新发送请求
      (3)数据数组拼接
  */
  onReachBottom() {    // 页面上滑，滚动条触底事件
    // 判断是否存在下一页数据
    if(this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页
      wx.showToast({ title: "没有更多商品了"});    // showToast提示框
    }else{
      // 存在下一页
      this.QueryParams.pagenum++;    // 页码加一
      this.getGoodsList();           // 发送请求
    }
  },

  /*
  下拉刷新页面
    1.触发下拉刷新事件
      注意：需要在json文件开启下拉刷新enablePullDownRefresh:true
      下拉加载样式：backgroundTextStyle："dark"
    2.重置数据数组，清空数据，重新发请求
    3.重置页码，设置为1
    4.重新发送请求
    5.数据请求回来了，需要关闭等待的加载效果  stopPullDownRefresh
  */
  onPullDownRefresh() {   // 监听⽤⼾下拉操作
    // 重置数组
      // 直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致
      // setData 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）
    this.setData({
      goodsList:[]
    })
    // 页码设置为1
    this.QueryParams.pagenum = 1;
    // 重新发送请求
    this.getGoodsList();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})