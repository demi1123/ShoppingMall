//Page Object
// 0 引入 用来发送请求的方法 一定要发路径补全
import { request } from "../../request/index.js";
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: []
    
  },
  //options(Object)
  // 页面开始加载就会触发的事件
  onLoad: function(options) {
    // 1 发送异步请求获取轮播图数据
    // 优化的手段可以通过es6的promise来解决这个问题
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result=> {
      this.setData({
        swiperList:result.data.message
      })
    })
  },
  getCatesList(){
    request({url:"/home/catitems"})
    .then(result=> {
      this.setData({
        catesList:result.data.message
      })
    })
  },
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result=> {
      const floorList = result.data.message;
      floorList.forEach((v,i) => {
        v.product_list.forEach((v,i) => {
          v.navigator_url = v.navigator_url.split("=")[1];
        });
      });
      this.setData({
        floorList
      })
    })
  }
});
  