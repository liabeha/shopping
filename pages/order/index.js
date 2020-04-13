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
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待收货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ]
  },

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

  onShow() {
    // 获取当前小程序的页面栈（是数组，最大为10个页面）
    let pages =  getCurrentPages();
    // 获取数组中最大的索引的数据（当前页面）
    let currentPage = pages[pages.length -1];
    // 获取type参数
    const {type} = currentPage.options;
    this.getOrders(type);
  },

  // 获取订单列表
  async getOrders(type) {
    const res = await request({url: "/my/orders/all", data:{type}});
  }

})