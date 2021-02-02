// pages/category/index.js
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 商品数据 category2
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容滚动条顶部距离
    scrollTop: 0
  },
  // 接口的返回数据
  cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 第一次发送请求
      0 web中的本地存储和小程序中本地存储的区别
        a 代码不同
          web: localStorage.setItem("key","value") localStorage.getItem("key")
          miniprogram: wx.setStorageSync("key","value") wx.getStorageSync("key");
        b 类型转换
          web: 不管存入什么类型数据，最终都会先调用toString(),把数据变成字符串再存
          miniprogram：不存在类型转换，存什么类型就获取什么类型的
      1 先判断一下本地存储中有没有旧的数据
      (time:Date.now(), data:[...])
      2 没有旧数据 直接发送请求
      3 有旧数据 同时 旧数据没有过期 就是用本地存储中的旧数据 */
    
      // 1 获取本地存储中的数据（小程序也存在本地存储技术）
      const Cates=wx.getStorageSync("cates");
      if(!Cates){
        this.getCates();
      }else{
        // 旧数据 过期时间
        if(Date.now()-Cates.time > 1000*60){
          this.getCates();
        }else{
          this.cates=Cates.data;
          let leftMenuList=this.cates.map(v => v.cat_name);
          let rightContent=this.cates[0].children;
          this.setData({
            leftMenuList,
            rightContent
          })
        }
      }
  },
  async getCates(){
    // request({
    //   url: "/categories"
    // })
    // .then(res=>{
    //   this.cates=res.data.message;

    //   // 北街口数据存入到本地存储
    //   wx.setStorageSync("cates",{time:Date.now(),data:this.cates});

    //   // 构造左侧的大菜单数据
    //   let leftMenuList=this.cates.map(v=>v.cat_name);
    //   // 构造右侧的商品数据
    //   let rightContent=this.cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 1 使用es7的async await来发送请求
    const res=await request({url:"/categories"});
    this.cates=res.data.message;

    // 北街口数据存入到本地存储
    wx.setStorageSync("cates",{time:Date.now(),data:this.cates});

    // 构造左侧的大菜单数据
    let leftMenuList=this.cates.map(v=>v.cat_name);
    // 构造右侧的商品数据
    let rightContent=this.cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })

  },

  // 左侧菜单的点击事件
  handleItemTap(e){
    /*
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值
     */
    const {index}=e.currentTarget.dataset;
    
    let rightContent=this.cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      // 重新设置右侧内容的scroll-view顶部距离0
      scrollTop: 0
    })
  }
})