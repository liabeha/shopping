import { getSetting, chooseAddress, openSetting, showModal, showToast} from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},          // 收货地址的本地缓存数据
    cart: [],             // 购物车数据
    totalPrice: 0,        // 总价格
    totalNum: 0           // 总数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 只触发一次
  },

  // 生命周期函数--监听页面显示（应该是响应式变化的吧）
  onShow() {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[];   // 在缓存中获取不到购物车数据时，为空数组（确保类型正确，不是字符串）   
    // 过滤购物车数组
    cart = cart.filter(v=>v.checked);    // filter过滤cart.checked=false的数组

    let totalPrice = 0;      // 总价格
    let totalNum = 0;        // 总数量
    cart.forEach(v=>{        // forEach遍历操作数组里的各个元素
        totalPrice += v.num * v.goods_price;   // let totalPrice会不断叠加
        totalNum += v.num;
    })
    // 把购物车数据重新设置回data中
    this.setData({    // 更新数据
      cart,
      address,
      totalPrice,
      totalNum
    });
  },

  // 支付
  // handleOrderPay() {
  //   // 获取缓存中的token
  //   const token = wx.getStorageSync("token");
  //   if(!token){
  //     wx.navigateTo({
  //       url: '/pages/auth/index',
  //     });
  //     return;
  //   }
  // }
  handleOrderPay() {
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/auth/index'
    });
  }
})