import { getSetting, chooseAddress, openSetting, showModal, showToast} from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置 api  获取用户的收货地址  wx.chooseAddress

  2 获取 用户 对小程序 所授予 获取地址的  权限 状态 scope
    1 假设 用户 点击获取收货地址的提示框 确定  authSetting scope.address 
      scope 值 true 直接调用 获取收货地址
    2 假设 用户 从来没有调用过 收货地址的api 
      scope undefined 直接调用 获取收货地址
    3 假设 用户 点击获取收货地址的提示框 取消   
      scope 值 false 
      1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
      2 获取收货地址
    4 把获取到的收货地址 存入到 本地存储中 
2 页面加载完毕
  0 onLoad  onShow 
  1 获取本地存储中的地址数据
  2 把数据 设置给data中的一个变量
3 onShow 
  0 回到了商品详情页面 第一次添加商品的时候 手动添加了属性
    1 num=1;
    2 checked=true;
  1 获取缓存中的购物车数组
  2 把购物车数据 填充到data中
4 全选的实现 数据的展示
  1 onShow 获取缓存中的购物车数组
  2 根据购物车中的商品数据 所有的商品都被选中 checked=true  全选就被选中
5 总价格和总数量
  1 都需要商品被选中 我们才拿它来计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 += 商品的单价 * 商品的数量
  5 总数量 +=商品的数量
  6 把计算后的价格和数量 设置回data中即可
6 商品的选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中和缓存中
  5 重新计算全选。总价格 总数量。。。
7 全选和反选
  1 全选复选框绑定事件 change
  2 获取 data中的全选变量 allChecked
  3 直接取反 allChecked=!allChecked
  4 遍历购物车数组 让里面 商品 选中状态跟随  allChecked 改变而改变
  5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中 
8 商品数量的编辑
  1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性 
    1 “+” "+1"
    2 "-" "-1"
  2 传递被点击的商品id goods_id
  3 获取data中的购物车数组 来获取需要被修改的商品对象
  4 当 购物车的数量 =1 同时 用户 点击 "-"
    弹窗提示(showModal) 询问用户 是否要删除
    1 确定 直接执行删除
    2 取消  什么都不做 
  4 直接修改商品对象的数量 num
  5 把cart数组 重新设置回 缓存中 和data中 this.setCart
9 点击结算
  1 判断有没有收货地址信息
  2 判断用户有没有选购商品
  3 经过以上的验证 跳转到 支付页面！ 
 */

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},          // 收货地址的本地缓存数据
    cart: [],             // 购物车数据
    allChecked: false,    // 全选按钮，check=true时为选中状态
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
    const cart = wx.getStorageSync("cart")||[];   // 在缓存中获取不到购物车数据时，为空数组（确保类型正确，不是字符串）
    
    // 计算购物车数组里的选中的数量（是否全选）
      // every方法会遍历检测数组里所有元素是否都符合指定条件，如果所有元素都满足条件，则返回 true
      // 但空数组调用every方法时，返回的也是true
      // length计算数组的长度，从1开始
    // const allChecked = cart.length?cart.every(v=>v.checked):false;   // v是每个的循环项，length长度为0，返回false
    
    // wx.setStorageSync("address", address);
    this.setData({address});
    this.setCart(cart);
  },

  // 点击收货地址
  /*
  1.调用小程序内置api，wx.chooseAddress获取用户地址
    (1)可以通过wx.getSetting获取用户的消息，包括用户是否给小程序获取地址的权限（状态：scope）
    (2)用户点击收货地址提示框为确定，authSetting，scope.address: true
    (3)用户点击收货地址提示框为取消，scope.address: false
      [1] 诱导用户自己打开授权设置页面，wx:openSetting
      [2] 当用户重新给予收货地址权限时，获取用户收货地址
    (4)没调用收货地址api，scope为underfined
  2.获取到的收货地址存储到本地
  */
  async handleChooseAddress() {

    // 没做简化前的代码
    // 获取用户权限
    // wx.getSetting({
    //   success: (result) => {
    //     // 获取权限，注意权限是否要通过键值对的方式来获取
    //     const scopeAddress = result.authSetting["scope.address"];     
    //     if(scopeAddress === true || scopeAddress === undefined) {
    //       // 调用小程序内置获取收货地址的api
    //       wx.chooseAddress({
    //         success: (result1) => {             
    //         },
    //         fail: () => {},
    //         complete: () => {}
    //       });
    //     }else{
    //       // 用户之前拒绝过授予权限，要诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2) => {
    //           // 用户授权后，点击返回就会调用以下代码
    //           // 成功后，就可以获取用户的收货地址了
    //           wx.chooseAddress({
    //             success: (result3) => {
    //             },
    //             fail: () => {},
    //             complete: () => {}
    //           })
    //         },
    //         fail: () => {},
    //         complete: () => {}
    //       });
    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // }); 

    // 简化后
    // 捕获异常，不捕获会报错
    try {
      // 获取用户权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 判断权限状态
      if(scopeAddress === false) {
        // 诱导用户打开授权页面
        await openSetting();
      }
      // 调用收货地址api
      let address = await chooseAddress();
      // 收货地址拼接
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      // 将收货地址保存到本地缓存中
      wx.setStorageSync("address", address);        
      }

      // 异常处理，这里是提出错误提示
      catch (erroe) {
        wx.showToast({
          title: '获取权限失败',
          image: '../../icons/false.svg',
          duration: 1800
        })
      }
  },

  // 实时检测，通过点击复选框来显示信息（购物车数量，总价）
  handeItemChange(e) {    // e是事件源对象
    // 获取被点击的复选框的商品id   等价于 const {goods_id} = e.currentTarget.dataset
    const goods_id = e.currentTarget.dataset.id;    // 函数回调过来的参数一般都在currentTarget.dataset
    // 要修改两处地方（缓存，AppData也就是data）
    // 获取购物车数组，let {cart}=this.data 等价于 let cart=this.data.cart
    let {cart} = this.data;
    // 获取被点击的商品的索引
    let index = cart.findIndex(v=>v.goods_id === goods_id);
    // 将当前的选中状态取反（复选框点一次是勾，再点一次是空）
    cart[index].checked =! cart[index].checked;

    this.setCart(cart);
  },

  // 设置购物车状态，重新计算底部的信息（全选、总结、结算的商品数量）
  setCart(cart) {
    let allChecked = true;   // 加载页面出来时，默认是全选
    let totalPrice = 0;      // 总价格
    let totalNum = 0;        // 总数量

    cart.forEach(v=>{        // forEach遍历操作数组里的各个元素
      if(v.checked) {
        totalPrice += v.num * v.goods_price;   // let totalPrice会不断叠加
        totalNum += v.num;
      }else{
        allChecked = false;    // 不用另外在every里遍历一次，性能增加
      }
    })
    // 判断商品是否都选中
    allChecked = cart.length != 0?allChecked:false;

    // 把购物车数据重新设置回data中
    this.setData({    // 更新数据
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    // 把购物车数据重新设置回缓存中
    wx.setStorageSync("cart", cart);
  },

  // 商品全选按钮功能实现
  handleItemAllCheck() {
    let {cart, allChecked} = this.data;
    allChecked = !allChecked;   // 全选按钮全部取反
    cart.forEach(v=>v.checked = allChecked);    // 将购物车商品复选框的选中状态与全选按钮的状态相同
    this.setCart(cart);    // 更新数据
  },

  // 商品 + - 按钮
  async handleItemNumEdit(e) {
    // 获取页面传递过来的参数
    const {operation,id} = e.currentTarget.dataset;
    let {cart} = this.data;
    const index = cart.findIndex(v=>v.goods_id === id);
    // 判断是否要删除
    if(cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal({content: "要删除该商品吗？"});
      if (res.confirm) {
        cart.splice(index, 1);    // splice(要删除元素的索引, 删除的数量)
        this.setCart(cart);       // 这里this指向success，要把它改成箭头函数
      } 
    }else {
      cart[index].num += operation;   // operation为1或-1
      this.setCart(cart);   // 更新数据
    }
  },

  // 结算功能
  async handlePay() {
    // 获取收货地址，和结算的商品数量
    const {address, totalNum} = this.data;
    // 判断是否已经选择了收货地址
    if(!address.userName) {
      await showToast({title: "您还没有选择收货地址"});
      return;
    }
    // 判断用户有没有选购商品
    if(totalNum === 0) {
      await showToast({title: "您还没有选购商品"});
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})