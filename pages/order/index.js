// pages/order/index.js
/**
 * 1 页面被打开的时候 onShow 
 *  00 onshow不用于onload，不能再形参获取参数options
 *    判断缓存中有没有token
 *  11 获取url上的参数type 
 *  22 根据type去发送请求获取订单数据
 *  33 渲染页面
 * 
 * 2 点击不同的标题 重新发送请求来获取和渲染数据
 * 
 */
import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive: true
      },
      {
        id:1,
        value:"待付款",
        isActive: false
      },
      {
        id:2,
        value:"待发货",
        isActive: false
      },
      {
        id:3,
        value:"退款/退货",
        isActive: false
      }
    ],
  },

  onShow: function () {
    // const token=wx.getStorageSync("token");
    //   if(!token){
    //     wx.navigateTo({
    //       url: '/pages/auth/index'
    //     });
    //     return;
    //   }

    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let {type} = currentPage.options;
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
},

  async getOrders(type){
    
    const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
      // 准备请求头参数
    const header={Authorization:token};
    const res=await request({url:"/my/orders/all",data:{type},header});
    console.log(res);
    this.setData({
      orders:res.data.message.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  changeTitleByIndex(index) {
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },

  handleTabsItemChange(e){
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    this.getOrders(index+1)
  }

  

  
})