// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {   // 存放接收父元素的数据
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e){
      // 获取被点击的索引
      const {index} = e.currentTarget.dataset;
      // triggerEvent触发父组件中的事件，参数：父组件的方法名，传给父组件的数据
      this.triggerEvent("tabsItemChange", {index});
    }
  }
})
