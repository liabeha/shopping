import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false     // 记录商品是否被收藏过
  },
  // 商品对象
  GoodsInfo: {},

  onShow: function () {
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length -1];
    let options = currentPage.options;
    const {goods_id} = options;
    this.getGoodsDetail(goods_id); 
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({url:"/goods/detail", data:{goods_id}});
    this.GoodsInfo = goodsObj;

    // 获取缓存中的数据
    let collect = wx.getStorageSync("collect")||[];    // 没有就在缓存中创建名为collect的空数组
    // 判断当前商品是否被收藏
    // some里面有一个是true，那整个就是true了（通过遍历来判断）
    let isCollect = collect.some(v=>v.goods_id === this.GoodsInfo.goods_id);

    this.setData({
      // 后端返回内容较多时，可以指定需要的赋值
      goodsObj:{
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // \.是获取到.  g表示获取到的全部，'.jpg'把webp结尾的替换成jpg
        // replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串
        // stringObject.replace(regexp/substr,replacement)
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },

  // 点击轮播图预览
  // 调用 wx.previewImage(Object object) 在新页面中全屏预览图片
  // 预览的过程中用户可以进行保存图片、发送给朋友等操作
  handlePrevewImage(e) {   // e是data-url传递过来的
    // 1.构造图片链接数组
    // map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 2.接收点击传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
      // current: current,   // 当前显示图片的http链接
      // urls: urls          // 需要预览的图片http链接列表
    })
  },

  // 加入购物车
  /*
  1.绑定点击加入购物车事件
  2.获取缓存中的购物车数据（同步缓存）
  3.先判断当前商品是否已经存在与购物车
    (1)商品存在，购物车数量加一
    (2)商品不存在，给购物车数组添加一个新元素，并带上购买数量num
    (3)重新把购物车数组填充到缓存中
  4.弹出提示消息
  */
  handleCartAdd() {
    // 获取缓存中的购物车数据（同步，等缓存获取完整，再往下执行）
      // 只要“||”前面为false,不管“||”后面是true还是false，都返回“||”后面的值
      // 只要“||”前面为true,不管“||”后面是true还是false，都返回“||”前面的值
    let cart = wx.getStorageSync("cart")||[];

    // 判断商品对象是否存在于购物车数组中（v是cart）
      // findIndex
      // 当数组中的元素在测试条件时返回 true 时, findIndex() 返回符合条件的元素的索引位置
      // false时，返回 -1
      // findIndex() 对于空数组，函数是不会执行的
      // 判断 cart.goods_id = GoodsInfo.goods_id
    let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);   // v是当前调用的元素/数组

    if(index === -1){
      // 不存在，第一次添加商品到购物车
      this.GoodsInfo.num = 1;         // 给GoodsInfo添加新属性num
      this.GoodsInfo.checked = true;    // 商品选中状态，涉及复选框和全选按钮
      this.GoodsInfo.order = 2;
      cart.push(this.GoodsInfo);   // push 向数组的末尾添加一个或多个元素，并返回新的长度
    }else{
      // 已经存在，购物车里的商品数量加一
      cart[index].num++;    // cart缓存的商品数据
    }

    // 把购物车重新添加到缓存中
    wx.setStorageSync("cart", cart);   // key, value

    // 弹出提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,    // true，1.5秒后用户才能再次点击（防止用户手抖）   
    })  
  },

  // 点击商品收藏
  handleCollect() {
    let isCollect = false;   // 默认没有收藏
    // 获取缓存数据
    let collect = wx.getStorageSync("collect")||[];
    // 判断当前商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
    // 当 index != -1，表示已经收藏过了
    if(index !== -1){
      // 找到该商品，从数组中删除
      collect.splice(index,1);  // 根据索引删除指定的值，1表示删除一个
      isCollect = false;     // 删除后，修改收藏状态为没收藏
      wx.showToast({
        title: '取消成功',
        icon: "success",
        mask: true
      });
    }else{
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: "success",
        mask: true
      });
    }
    wx.setStorageSync("collect", collect);
    // 修改data里的数据
    this.setData({
      isCollect
    })
  }
})